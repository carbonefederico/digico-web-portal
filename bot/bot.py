import time
from pickle import FALSE
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.headless = False
options.set_preference("general.useragent.override", "selenium")
options.add_argument("--width=1500")
options.add_argument("--height=1300")
browser = webdriver.Firefox(options=options)




browser.get("https://digico-web-portal.glitch.me/index.html")
time.sleep(3)
browser.find_element(By.ID, "home").click()
time.sleep(3)
browser.find_element(By.NAME, "username").click()
browser.find_element(By.NAME, "username").send_keys("carbone.federico@gmail.com")
browser.find_element(By.ID, "password").send_keys("PingDemo01")
browser.find_element(By.CSS_SELECTOR, "#login-submit > div").click()
browser.find_element(By.ID, "logout").click()