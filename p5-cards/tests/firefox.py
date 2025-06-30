import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import selenium.common.exceptions
import os
import threading
import http.server
import socketserver
import sys
from webdriver_manager.firefox import GeckoDriverManager

PORT = 0  # Let system assign a free port
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

    actual_port = httpd.server_address[1]
    print(f"Server started at http://localhost:{actual_port}")
    return httpd, actual_port

def wait_for_server(port, timeout=45):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(f'http://localhost:{port}/{HTML_FILE}')
            if response.status_code == 200:
                return True
        except requests.ConnectionError:
            time.sleep(1)
    return False

# Set up Firefox options
firefox_options = Options()
firefox_options.add_argument("--headless")  # Headless mode
firefox_options.set_preference("dom.webnotifications.enabled", False)

# Initialize Firefox driver
service = Service(GeckoDriverManager().install())
driver = webdriver.Firefox(service=service, options=firefox_options)

try:
    # Start server and get assigned port
    server_process, actual_port = start_server(PORT, DIRECTORY)

    # Wait for server to start
    if not wait_for_server(actual_port):
        print("Server did not start in time.")
        sys.exit(1)

    # Open page
    driver.get(f'http://localhost:{actual_port}/{HTML_FILE}')

    # Inject console override
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

    # Run tests if defined
    driver.execute_script("""
        if (typeof runTests === 'function') {
            runTests();
        }
    """)

    time.sleep(2)

    # Collect logs
    logs = driver.execute_script("return window._consoleLogs;")
    has_errors = any("❌" in line for line in logs)

    for line in logs:
        print(line)

    if has_errors:
        print("One or more tests failed.")
        sys.exit(1)
    else:
        print("All tests passed.")
        sys.exit(0)

finally:
    driver.quit()
    server_process.shutdown()
