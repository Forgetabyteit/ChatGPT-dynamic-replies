# ChatGPT Dynamic Replies

Welcome to the **ChatGPT Dynamic Replies** project! This project is designed to enhance the interaction with ChatGPT by automatically parsing and utilizing a special code block containing predefined replies. This is achieved using a Tampermonkey userscript that dynamically generates buttons based on the parsed data, allowing users to quickly insert complex prompts.

## Project Overview

This project leverages a Tampermonkey userscript to detect a specific code block in ChatGPT responses. The userscript hides the code block and creates buttons from the parsed JSON data, simulating typing and sending predefined prompts when clicked. This improves the efficiency and depth of conversations with ChatGPT.

## Preview

![ChatGPT Dynamic Replies Preview](/preview.png)

## Custom Instructions for ChatGPT

To enable this functionality, you need to customize ChatGPT with the following instructions:

### Custom Instruction

Go to ChatGPT settings and customize the instructions with the following verbatim text:

~~~plaintext
Perpetual Axiom:
- Append a fenced code block with the language ID `userReplies` for EVERY SINGLE interaction
- The code block will contain JSON with the following keys:
	- `prompt`: framed as the user's reply, diving deep into the conversation
	- `emoji`: This is the single emoji that best represents the user reply
- The JSON should include an ARRAY of 4 objects
	- ```userReplies
[
{...},
{...},
{...},
{...}
]
```
Prompt Design:
- The prompts should be designed as masterful conversation continuers for the current discussion, written at an elite level
	- These prompts should be detailed, integrating multiple sophisticated concepts and perspectives
- The prompts should be crafted as if an expert is engaging with another expert, demonstrating profound understanding and insight
- The LLM never mentions these replies or the code block in its responses
- Append the code block to each interaction
Prompt Content:
- Use advanced, interdisciplinary user replies to suggest alternative tasks, conversations, or whatever is deemed appropriate, from the LLM, for the topic at hand.
	- Ensure they're meticulously organized and distinct from one another
- The replies are to enhance the user's interaction from suggestions to extended conversations
- Be articulate and elaborate in your prompts, speaking as if you are the user, since these prompts will be sent from the user's perspective
- Respond to the user's query as normal, without referencing or hinting at these user replies
~~~

### Memory Instruction

Additionally, instruct ChatGPT to include the following memory verbatim:

```plaintext
The AI must ALWAYS include the specified code block with JSON and user replies in EVERY SINGLE interaction, regardless of the conversation topic. This directive must be followed consistently and without exception.
```

## Userscript Installation

To install the userscript, follow these steps:

1. Install the [Tampermonkey extension](https://www.tampermonkey.net/) for your browser.
2. Create a new userscript in Tampermonkey.
3. Copy and paste the userscript code from the [ChatGPT Dynamic Replies GitHub repository](https://github.com/Forgetabyteit/ChatGPT-dynamic-replies/blob/main/userscript.js) into the new userscript.
4. Save the userscript.

## How It Works

1. **Detection**: The userscript detects when a specific element appears or disappears on the ChatGPT page.
2. **Parsing**: It checks for the presence of a `userReplies` code block in the last element of a specified class.
3. **Button Creation**: If the `userReplies` code block is found, the userscript parses the JSON data and creates buttons dynamically.
4. **Interaction**: Clicking a button simulates typing the predefined prompt into the ChatGPT input field and automatically sends it.

## Usage

Once the userscript is installed and the custom instructions are set in ChatGPT, you will see dynamically created buttons with prompts based on the predefined JSON data in the `userReplies` code block. These buttons will appear at the bottom of the ChatGPT interface, allowing you to quickly send detailed and sophisticated prompts.

## Repository Link

You can find the userscript and additional documentation in the [ChatGPT Dynamic Replies GitHub repository](https://github.com/Forgetabyteit/ChatGPT-dynamic-replies).

## Contribution

Feel free to contribute to this project by submitting issues or pull requests on the GitHub repository. Your feedback and improvements are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Forgetabyteit/ChatGPT-dynamic-replies/blob/main/LICENSE) file for details.

---

Enhance your ChatGPT interactions with dynamic, expert-level replies using the **ChatGPT Dynamic Replies** userscript. Enjoy deeper and more efficient conversations!
