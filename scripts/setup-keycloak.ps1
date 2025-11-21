# Script to restart Keycloak and apply the realm import
Write-Host "Restarting Keycloak to apply realm import..."
docker-compose up -d --force-recreate keycloak
Write-Host "Keycloak is restarting. Please wait a moment for it to initialize."
Write-Host "You can check logs with: docker-compose logs -f keycloak"
