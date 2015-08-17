var app = require('app')
  , BrowserWindow = require('browser-window')
  , Menu = require('menu');

require('crash-reporter').start();

var template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click: function() {
          app.quit();
        }
      },
      {
        label: 'Dev Tools',
        accelerator: 'F12',
        click: function() {
          app.mainWindow.toggleDevTools();
        }
      },
      {
        label: 'Refresh',
        accelerator: 'F5',
        click: function() {
          app.mainWindow.reload();
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: function() {

        }
      }
    ]
  }];

menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
//menu.items[1].submenu.items[0].enabled = false;

/*
app.setUserTasks([{
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New Window',
    description: 'Create a new window'
  }
]);
*/
app.on('ready', function() {

  app.mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    center: true
  });
  app.mainWindow.loadUrl('file://' + require('path').dirname(__dirname) + '/root/public/index.html');
  
  app.mainWindow.toggleDevTools();
});


app.on('window-all-closed', function() {

  if (process.platform != 'darwin') {
    app.quit();
  }
});
