# Chat GPT messages to Github repository

WORKFLOW: 

**Github repository and fine-grained key access**
- Create a github repository where you want to store the ChatGPT messages
- Create a fine-grained key for the repo, make sure to save the key somewhere, you need to use it later: https://github.com/settings/tokens?type=beta
![image](https://github.com/Peccer/ChatGPT_to_Github_repo/assets/5719371/83a3120d-1c7a-4147-be8d-288c19018118)

**Google Cloud Function (GCF)**
1. Create 2nd gen Google Cloud function (GCF) - https://console.cloud.google.com/functions/list
2. In the configuration (first step when editing/creating the GCF): Add an environment variable named "GIT_TOKEN" and as value, use the fine-grained secret that you created before.
![image](https://github.com/Peccer/ChatGPT_to_Github_repo/assets/5719371/4cef0036-851a-4d5f-80aa-6946c7ffeaf9)

3. Select Python 3.11 in runtime
![image](https://github.com/Peccer/ChatGPT_to_Github_repo/assets/5719371/0b6cf3b9-115c-4f86-b666-3628f758002a)

4. Copy paste the contents of the main.py file in this repository in the GCF file. Do the same for the requirements.txt file.
5. Make sure to give the entry point the same name as the function in main.py. In this case "cors_enabled_function"
![image](https://github.com/Peccer/ChatGPT_to_Github_repo/assets/5719371/874e64d9-e37f-4ed7-aef3-351b31440b76)

6. Deploy your function. This can take a minute or two

**Final steps**
1. Follow the instructions in the beginning from "fetch_send_chatgpt_messages.js" (adjust variables with your own input as instructed)
2. Copy the contents of "fetch_send_chatgpt_messages.js"
3. Navigate to chat.openai.com and open your developer console (F12)
4. Paste and press Enter
5. Wait for a while, can take a minute or 5
6. Check your github repo. 
7. Repeat from step 4 if not all of your (most recent 100) chats are stored in the repository. Maybe have to repeat this a couple of times.
