// Add your token, How?:
// Open your browser > go to chat.openai.com (and log in if needed) > open developer console (F12) > open the "network" tab
// Click on one of your "chat messages" in the sidebar
// In network tab of developer console, look for "conversations?offset=0&limit..." > click on it > check "Headers" and look for the "authorization" part, copy the bit after "Bearer "

const bearer_token = 'eyJ........';
const headers = { 'Authorization': 'Bearer '+bearer_token}; // auth header with bearer token

// Create a github repository where you want your chat gpt results to appear & add the name of the repo here
const github_repo_name = "chat_gpt_results"

// Delay function to introduce delay
const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

// Function to fetch all conversations - max messages = 100. Adjust the offset parameter to grab older messages
async function get_all_conversations() {
  const response = await fetch('https://chat.openai.com/backend-api/conversations?offset=0&limit=100&order=updated', { headers });
  const data = await response.json();
  return data.items;
};

// Function to fetch data for a given conversation id
async function get_conversation_data(id) {
  const response = await fetch(`https://chat.openai.com/backend-api/conversation/${id}`, { headers });
  const data = await response.json();
  return data;
}

// Function to get data for all conversations
async function get_message_data(conv_id_array) {
  const conversations_array = [];
  for (const id of conv_id_array) {
    try {
      const data = await get_conversation_data(id);
      conversations_array.push(data);
      await delay(500);
    } catch (error) {
      console.log(`Error fetching conversation data for id: ${id}`, error);
    }
  }
  return conversations_array;
};

// Function to clean the mapping data and return an array of objects with title and gpt_text
function clean_mapping(data_arr) {
  const text_arr = [];
  for (const data of data_arr) {
    const title = data.title;
    const mapping = [data.mapping];
    console.log(mapping)
    let text_to_join = "";
    for (const message of mapping) {
      try {
        const text = message.message.content.parts[0];
        text_to_join += text;                
      } catch (error) {
        console.log("Skipping message because no content", error);
      }
    }
    text_arr.push({ "title": title, "gpt_text": text_to_join,"repo_name": github_repo_name });
  }
  return text_arr;
};

// Function to post data to a Google Cloud Function
async function gpt_to_gcf(arr_data) {
  const gcf_link = "https://chatgpt-to-github-f2lwasf6hq-uc.a.run.app/";
  for (const data of arr_data) {
    try {
      const response = await fetch(gcf_link, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Error posting data to GCF", error);
    }
  }
};

// Main function to orchestrate the whole process
async function process_conversations() {
  try {
    const conversations = await get_all_conversations();
    const conversation_id_array = conversations.map(conversation => conversation.id);
    const conversation_data = await get_message_data(conversation_id_array);
    const text_data = clean_mapping(conversation_data);
    await gpt_to_gcf(text_data);
  } catch (error) {
    console.error("Error processing conversations", error);
  }
}

process_conversations();
