# FarmSignal

## _This repository is currently under development._

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)
[![Documentation Status](https://readthedocs.org/projects/farmsignal/badge/?version=latest)](http://docs.farmsignal.net/en/latest/?badge=latest)

An open-source, easy-to-use automated plant watering solution.

## How to contribute to docs
1. Make sure to follow the steps [here](https://docs.readthedocs.io/en/stable/intro/getting-started-with-sphinx.html) to install Sphinx.
2. Make a new `.rst` file withing the `/docs` folder and place it anywhere other the the folder starting with an underscore `_`
3. Once you finish your `.rst` file, compile it by running `make html` in the `/docs` folder.
4. Open up the `.html` page that was just create with your browser in the `docs/_build/html` folder to view your changes
5. Make a pull request so I can go over your changes

## To compile documentation
1. cd `docs/`
2. `make html`
 ## To view compiled HTML changes
 If on vscode you can download [this](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
 1. Go to `docs/_build/html/index.html`
 2. Open the page on your browser or open the page using live server
