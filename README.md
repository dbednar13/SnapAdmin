# SnapAdmin

Web based UI for SnapRaid. Inspired by [Elucidate](https://github.com/Smurf-IV/Elucidate). If you wish for a standard Windows application to manage your SnapRaid installation, I recommend checking it out.

## Installing

- [Install SnapRaid](https://www.snapraid.it/download) if not already installed
- If necessary, install the [latest version of Node ](https://nodejs.org/en/download)
- Download the latest release [from Github](https://github.com/dbednar13/SnapAdmin/releases)
- Extract the zip to the location of your choice.

## System Setup

To set up the application to run as a service, follow these steps:

### Linux

- Create the service file

  ```bash
  sudo nano /etc/systemd/system/snapAdmin.service
  ```

- Paste the following replacing /opt/snapAdmin with the location where you extracted the zip.

  ```ini
  [Unit]
  Description=SnapAdmin Service
  After=network.target

  [Service]
  Type=simple
  User=root
  WorkingDirectory=/opt/snapAdmin
  ExecStart=/usr/bin/node /opt/snapAdmin/index.js
  Restart=on-failure
  RestartSec=5

  [Install]
  WantedBy=multi-user.target
  ```

- Enable and run the service

  ```bash
  sudo systemctl daemon-reload
  sudo systemctl enable snapAdmin.service
  sudo systemctl start snapAdmin.service
  ```

### Windows

- If necessary, install the [Non-Sucking Service Manager (NSSM)](https://nssm.cc/download)
- Open command prompt and execute the following commands:
  1. Install the service with the path to your node executable

  ```cmd
  nssm install "SnapAdmin" "C:\Program Files\nodejs\node.exe"
  ```

  2. Set the root directory of your Node.js application

  ```cmd
  nssm set "SnapAdmin" AppDirectory "C:\path\to\your\app"
  ```

  3. Set your starting script as the argument

  ```cmd
  nssm set "SnapAdmin" AppParameters "index.js"
  ```

  4. Start the service

  ```cmd
  nssm start "SnapAdmin"
  ```

## Initial Setup

Once the service is running, open `http://localhost:9153/` in your browser. To change the default port, open the Settings tab or navigate to `/admin-config`.

In the Settings page, provide the path to your `snapRAID.conf` file. If you have not used SnapRAID before or have not modified its configuration, you can find the default config next to the SnapRAID executable on your system.
