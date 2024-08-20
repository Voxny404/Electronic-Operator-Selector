# Eos: Interactive Command-Line Menu System
Eos is a highly customizable and interactive command-line menu system designed to streamline operations in terminal environments. It allows users to navigate through nested menus, execute system commands, and display text-based content, all within a colorful, user-friendly interface.

Key Features:
- Dynamic Menu Navigation: Eos supports hierarchical menus, enabling users to drill down into submenus or go back to previous levels seamlessly.
- Command Execution: Each menu option can be linked to a system command, allowing for quick execution of tasks directly from the interface.
- Breadcrumb Navigation: The application displays a breadcrumb trail, showing the user's current location within the menu structure.
- Colorful Interface: Eos uses ANSI escape codes to add color and style to the terminal, enhancing the user experience with options for dimming, blinking, and error highlighting.
- Customizable: Users can easily configure the menu options, colors, and commands, making it adaptable to various use cases.
- Developer Mode: Eos includes a developer mode that logs the configuration for debugging and customization purposes.
- Ideal for system administrators, developers, and power users, Eos simplifies complex command-line tasks by organizing them into an intuitive menu system, making it easier to manage and execute operations without needing to remember long command strings.

## How to start
node index.js

## How to configure
````
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
    1:{ name: "Notes", text:"You can have as many menus as you like to!" },
    2:{ name: "Open CMD", command: "start cmd" },
}
````
This object is used to configure the program. You can add as many sub menus as you like.

## Note
The key words are name, command, text, menu and they are case sensitive.
You can move down and up with the arrow keys or W and S. To select hit Enter.

- NAME is used to give the command a name and will be shown on the display.
- COMMAND is used to execute CMD commands.
- TEXT is used to display helpful information such as a discription.
- MENU key word is used to create another menu within existing menu.

## Commands for windows
Opens an app
````
cd C:/ && start cmd /k node index.js
````
Opens the explorer menu
````
cd C:/ && start .
````

Make sure to replace the directory path and the launch option to your needs