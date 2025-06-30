# Running it locally

First navigate to the project root, not minigolf (this is needed because otherwise the github workflow wouldn't run)
```
cd {github-folder-name}
```

then install dependencies: (You should only need to do this once)
```
sudo apt-get update
    sudo apt-get install -y \
        firefox \
        xdg-utils \
        wget \
        python3 \
        python3-pip

pip install selenium webdriver-manager requests --break-system-packages
```

Run the testing script:
```
python p5-cards/tests/firefox.py
```