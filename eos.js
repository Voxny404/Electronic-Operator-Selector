const readline = require('readline');
const { exec } = require('child_process');

class Eos {
    constructor() {
        this.options = {}
        this.menuTitleList = ["Menu"]
        this.currentFunctionTitle = ""
        this.currentOptionMenu = {}
        this.lastOptionMenu = {}
        this.currentSelectedIndex = 0
        this.isSelected = false

        this.hasColor = true

        // change this to change color
        this.color_value = 2 

        this.color_mode_dim = "\x1b[2m"
        this.color_mode_reset = "\x1b[0m"
        this.color_mode_blinking = "\x1b[5m"
        this.color_mode_error = "\x1b[31m"
        this.color_mode_color = `\x1b[3${this.color_value}m`
        this.color_mode_selected = `\x1b[4${this.color_value}m\x1b[30m`

        this.chunkSizeText = 50
        this.dev_mode = false
    }

    init() {
        console.clear()
        this.currentOptionMenu = this.options
        readline.emitKeypressEvents(process.stdin);
    
        if (process.stdin.isTTY) process.stdin.setRawMode(true);
        this.makeHeader()
        this.optionDisplay()

        process.stdin.on('keypress', (chunk, key) =>  this.handleStdinListener(key));
    }

    setOptions(config) {
        this.options = config
        if (this.dev_mode) console.log(this.options);
    }

    handleStdinListener(key) {
        if (!key) return
    
        if (key.name == 'q' || key.name == 'escape' ) process.exit();
        
        if (!this.isSelected) {
            if (key.name == "up" || key.name == "w") this.currentSelectedIndex -= 1
            if (key.name == "down" || key.name == "s") this.currentSelectedIndex += 1
            if (key.name == "return") this.selected()
            if (key.name != "return") this.optionDisplay()
            return 
        }

        if (key.name == "backspace" || key.name == "return") this.goingBack()
        
    }

    makeHeader () {
        const logo = `${this.color_mode_color}
        Electronic Operator Selector
        ░▒▓████████▓▒░▒▓██████▓▒░ ░▒▓███████▓▒░ 
        ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
        ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
        ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░  
        ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░ 
        ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░ 
        ░▒▓████████▓▒░▒▓██████▓▒░░▒▓███████▓▒░  
        ${this.color_mode_dim}Version 0.1                 by Voxny404

        ${this.color_mode_dim}Press Q or ESC to exit!\n${this.color_mode_reset}`
        

        console.log(logo);
    }

    makeBreadCrumbs() {
        let cloneOfMenuTitleList = []
       
        this.menuTitleList.forEach(element => cloneOfMenuTitleList.push(element))
        cloneOfMenuTitleList.pop()

        const menuPath = cloneOfMenuTitleList.join(" > ")
        const arrowDisplay = menuPath ? " > " : ""
        const currentFunctionTitleFormating = ` : ${this.addColor(this.currentFunctionTitle.toLowerCase(), "blink")}`
        const titleDisplayFunctionTitle = this.currentFunctionTitle ? currentFunctionTitleFormating : ""
        const titleDisplayName = arrowDisplay + this.menuTitleList.slice(-1)[0].toUpperCase() + titleDisplayFunctionTitle
        const titleDisplayFormating = " "+this.addColor(menuPath.toUpperCase(), "dim") + this.addColor(titleDisplayName) +" "
        const titleDisplay = this.addColor(" ".repeat(10)+"-".repeat(5)) + titleDisplayFormating + this.addColor("-".repeat(5))
        
        return `${titleDisplay}\n\n`
    }

    addColor(text, status) {
        if (!this.hasColor) return text
        if (!status) return this.color_mode_color + text + this.color_mode_reset
        if (status == "dim") return this.color_mode_color + this.color_mode_dim + text + this.color_mode_reset
        if (status == "blink") return this.color_mode_color + this.color_mode_blinking + text + this.color_mode_reset
        if (status == "selected") return this.color_mode_selected + " " +text + " " + this.color_mode_reset
        if (status == "error") return this.color_mode_error + text + this.color_mode_reset
    }

    optionDisplay() {
        const menuEntrySize = Object.keys(this.currentOptionMenu).length-1
        let stringToRender = ""
 
        stringToRender += this.makeBreadCrumbs()
        
        Object.keys(this.currentOptionMenu).forEach(index => {
            if (this.currentSelectedIndex > menuEntrySize || this.currentSelectedIndex < 0) {
                this.currentSelectedIndex = 0
            }

            stringToRender += " ".repeat(10)

            if (this.currentSelectedIndex != index) {
                stringToRender += this.addColor(this.currentOptionMenu[index].name) + "\n"
            }
            else stringToRender += this.addColor(this.currentOptionMenu[index].name, "selected") +"\n"
        })

        if (stringToRender.trim() == "") {
            stringToRender = " ".repeat(5) + this.addColor("No operations set up yet!")
        }
        
        this.renderText(stringToRender, "normal");
    }

    renderText (text, clearOption) {
    
        this.clearText(text, clearOption)
        process.stdout.write(text)
    }

    clearText () {
        if (this.dev_mode) return console.log(this.addColor("Dev_mode = enabled !!!","error"));

        console.clear()
        process.stdout.cursorTo(0)
        this.makeHeader()
        
    }

    goingBack() {
        this.currentFunctionTitle = ""
        this.clearText("", "all")
        this.isSelected = false
        this.optionDisplay()
    }

    selected () {
        this.isSelected = true
        const currentObject = this.currentOptionMenu[this.currentSelectedIndex]
       
        if (!currentObject) return console.log(this.addColor("WARNING !!! OBJECT MISSING", "error", this.currentOptionMenu));
        
        if (currentObject?.menu) {
            
            // save last menu this can be improved!
            this.menuTitleList.push(currentObject.name)
            this.lastOptionMenu = this.currentOptionMenu
            
            // check if menu has back option
            const hasNoBackOption = currentObject.menu[Object.keys(currentObject.menu).length-1].name !== "Back" 
            if (hasNoBackOption) currentObject.menu[Object.keys(currentObject.menu).length] = {name: "Back", command: "back"}
            
            this.currentOptionMenu = currentObject.menu
            this.isSelected = false
            this.clearText("", "all")
            this.optionDisplay()
            return
        }
    
        
        if (currentObject?.command == "back") {
            this.menuTitleList.pop()
            this.currentFunctionTitle = ""

            // rests to default menu when no index was found this can be improved
            this.currentOptionMenu = this.lastOptionMenu !== this.currentOptionMenu ? this.lastOptionMenu : this.options
            if (this.lastOptionMenu !== this.currentOptionMenu) this.menuTitleList = ["menu"]
            this.isSelected = false
            this.lastOptionMenu = this.currentOptionMenu
            this.clearText("", "all")
            this.optionDisplay()

            if (!this.currentOptionMenu) console.log(this.addColor("WARNING!! LOST MENU!", "error"), this.currentOptionMenu, this.lastOptionMenu, this.options);
            
            return
        }
    
        
        this.currentFunctionTitle = currentObject?.name
       
        this.renderText(this.makeBreadCrumbs())

        if (currentObject?.command && !currentObject?.text) {
            this.executeCommand(currentObject.command)
            const text = this.parseText(`Executed command ${currentObject.command}`, this.chunkSizeText)
            console.log(" ".repeat(5) + this.addColor(text,"blink"))
        }
    
        else {
            const text = this.parseText(currentObject.text, this.chunkSizeText)
            console.log(" ".repeat(5) + this.addColor(text))
        }
        
        if (!currentObject?.menu) console.log("\n"+" ".repeat(5) + this.addColor(`Back`,"selected"))
    }

    executeCommand (cmd) {
        
        exec(cmd, (err, stdout, stderr) => {
            if (err) return;
            this.clearText("", "all")
            // the *entire* stdout and stderr (buffered)
            if (stdout) console.log(this.addColor(stdout))
            if (stderr) console.log(this.addColor(stderr), "error")
    
            console.log("\n"+" ".repeat(5) + this.addColor(`Back`,"selected"))
        });
    }

    parseText(text, chunkSize) {
        const words = text.split(' ');
        let parsedText = '';
        let currentChunk = '';
    
        words.forEach(word => {
            if ((currentChunk + word).length <= chunkSize) {
                currentChunk += (currentChunk ? ' ' : '') + word;
            } else {
                parsedText += currentChunk + "\n" + ' '.repeat(5);
                currentChunk = word;
            }
        });
    
        if (currentChunk) {
            parsedText += currentChunk; // Add the last chunk
        }
    
        return parsedText;
    }
}

module.exports = new Eos();