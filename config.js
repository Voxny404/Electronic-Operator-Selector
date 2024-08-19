const object = {
    0:{ 
        name: "Example", 
        menu: {
            0:{name: "Show directory", command: "dir"},
            1:{name: "Description", text: "This is a test configuration which shows the directory"},
            2:{
                name: "More", 
                menu:{
                	0:{name:"Description", text:"An example of how too use multiple menus"},
                    1:{
                        name: "More", 
                        menu:
                        {
                            0:{ name:"hello world", text:"Hi!" }
                        }
                    }
            }},
        }, 
    },
    1:{ name: "Test Notes", text:"This is a very long text that needs to be cut and formatted for the console output. This is a very long text that needs to be cut and formatted for the console output. This is a very long text that needs to be cut and formatted for the console output. This is a very long text that needs to be cut and formatted for the console output." },
    2:{ name: "Open CMD", command: "start cmd" },
    3:{ name: "Info", text: "You have to open the config.js file in this directory. You can then apply your own settings. Make sure to use the correct syntax." },
}

module.exports = object