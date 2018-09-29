#!/bin/bash

# Replace the following URL with a public GitHub repo URL
gitrepo=https://github.com/TheJegan/firebase-service-poc
webappname=firebase-poc
myResourceGroup=coffee-concepts

# Create a resource group.
az group create --location westus2 --name $myResourceGroup

# Create an App Service plan in STANDARD tier (minimum required by deployment slots).
az appservice plan create --name $webappname --resource-group $myResourceGroup --sku S1

# Create a web app.
az webapp create --name $webappname --resource-group $myResourceGroup \
--plan $webappname

#Create a deployment slot with the name "staging".
az webapp deployment slot create --name $webappname --resource-group $myResourceGroup \
--slot staging

# Deploy sample code to "staging" slot from GitHub.
az webapp deployment source config --name $webappname --resource-group $myResourceGroup \
--slot staging --repo-url $gitrepo --branch master --manual-integration

# Copy the result of the following command into a browser to see the staging slot.
echo http://$webappname-staging.azurewebsites.net

# Swap the verified/warmed up staging slot into production.
az webapp deployment slot swap --name $webappname --resource-group $myResourceGroup \
--slot staging

# Copy the result of the following command into a browser to see the web app in the production slot.
echo http://$webappname.azurewebsites.net


#enable https

#CI-CD
