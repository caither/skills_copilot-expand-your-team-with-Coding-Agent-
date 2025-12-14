# Prepare python environment
pip install -r src/requirements.txt

# Prepare Node.js environment for testing
npm install

# Prepare MongoDB Development DB
./.devcontainer/installMongoDB.sh
./.devcontainer/startMongoDB.sh