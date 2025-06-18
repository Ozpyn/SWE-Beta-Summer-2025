import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import selenium.common.exceptions
import os
import threading
import http.server
import socketserver
from webdriver_manager.firefox import GeckoDriverManager

PORT = 8001
HTML_FILE = "index.html"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DIRECTORY = os.path.join(os.path.dirname(SCRIPT_DIR))

def start_server(port, directory):
    handler = http.server.SimpleHTTPRequestHandler
    os.chdir(directory)
    httpd = socketserver.TCPServer(("", port), handler)

    server_thread = threading.Thread(target=httpd.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    print(f"Server started at http://localhost:{port}")
    return httpd

def wait_for_server(timeout=45):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(f'http://localhost:{PORT}/{HTML_FILE}')
            if response.status_code == 200:
                return True
        except requests.ConnectionError:
            time.sleep(1)
    return False

# Set up Firefox options
firefox_options = Options()
firefox_options.add_argument("--headless")
firefox_options.add_argument("--no-sandbox")
firefox_options.add_argument("--disable-dev-shm-usage")

# Initialize driver
service = Service(GeckoDriverManager().install())
driver = webdriver.Firefox(service=service, options=firefox_options)

try:
    # Start the HTTP server
    server_process = start_server(PORT, DIRECTORY)

    # Wait for the server to be up and serving the HTML file
    if not wait_for_server():
        print("Server did not start in time.")
        exit(1)

    # Navigate to the page
    driver.get(f'http://localhost:{PORT}/{HTML_FILE}')

    # Inject JavaScript to override console methods
    driver.execute_script("""
        window._consoleLogs = [];
        ['log', 'error', 'warn', 'info'].forEach(function(level) {
            const orig = console[level];
            console[level] = function(...args) {
                window._consoleLogs.push(`[${level.toUpperCase()}] ` + args.join(' '));
                orig.apply(console, args);
            };
        });
    """)

    # OPTIONAL: run tests (if not auto-run)
    driver.execute_script("runTests();")

    # Give time for tests to run
    time.sleep(2)

    # Get logs from browser
    logs = driver.execute_script("return window._consoleLogs;")
    has_errors = False

    for line in logs:
        print(line)
        if "❌" in line:
            has_errors = True

    if has_errors:
        print("One or more tests failed.")
        exit(1)
    else:
        print("All tests passed.")
        exit(0)

finally:
    driver.quit()
