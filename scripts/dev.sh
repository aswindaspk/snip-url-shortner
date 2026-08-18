#for running the project in development mode, this script starts the necessary services using Docker Compose and runs the server using tsx in watch mode. It also ensures that the services are stopped when the script exits or is interrupted.
#!/bin/bash

set -e #exit the script if any command fails

cleanup() {
    echo "stopping dev services..."
    sudo docker compose down
}
#trap tells the script to run the cleanup function when it receives an EXIT, INT, or TERM signal. This ensures that the cleanup function is called when the script exits, is interrupted, or is terminated.
trap cleanup EXIT INT TERM

echo "starting dev services..."
sudo docker compose up -d
npx tsx watch src/server.ts