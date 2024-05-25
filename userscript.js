// ==UserScript==
// @name         ChatGPT dynamic user replies
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Detects when a specific element appears and disappears on the page, then checks for userReplies code block in the last element of a specified class and logs the parsed JSON or "none" if not found. Hides the pre element containing the userReplies code block at all times using CSS styling. Adds styled buttons dynamically based on userReplies JSON data before a specified element, with transparent background and inherited font color. Simulates typing the message in #prompt-textarea and clicks the send button on button click. Destroys buttons when stop button appears again.
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CONFIG object for easy adjustments
    const CONFIG = {
        buttonContainerClass: 'userReplies-buttons',
        buttonClass: 'userReplies-button',
        textareaSelector: '#prompt-textarea',
        sendButtonSelector: 'button[data-testid="send-button"]',
        formElementSelector: 'form .flex.w-full.items-center',
        targetElementSelector: '.absolute.bottom-1.right-2.p-1.md\\:right-3.md\\:p-2 .flex.h-full .flex.h-full.flex-row.items-center.justify-center.gap-3 button[aria-label="Stop generating"]',
        mutationObserverConfig: { childList: true, subtree: true },
        checkInterval: 1000
    };

    let elementVisible = false; // Track the visibility state of the element
    let isEditing = false; // Track if any prompt is currently being edited

    // Inject CSS to hide <pre> elements containing userReplies code blocks and style buttons
    const style = document.createElement('style');
    style.textContent = `
        pre:has(code.language-userReplies) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
        }
        .${CONFIG.buttonContainerClass} {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        }
        .${CONFIG.buttonClass} {
            width: 49%;
            padding: 10px;
            border: 1px solid var(--border-medium);
            border-radius: 8px;
            background-color: transparent;
            color: inherit;
            cursor: pointer;
            text-align: left;
            display: flex;
            align-items: center;
            justify-content: space-between;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            transition: height 0.3s ease, background-color 0.3s ease;
        }
        .${CONFIG.buttonClass} .emoji {
            font-size: 16px;
            margin-right: 10px;
        }
        .${CONFIG.buttonClass} .prompt {
            flex-grow: 1;
            font-size: 0.9em;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .${CONFIG.buttonClass} .edit {
            cursor: pointer;
        }
        .${CONFIG.buttonContainerClass}:hover .${CONFIG.buttonClass} {
            white-space: normal;
            background-color: rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.append(style);

    // Function to simulate typing
    const simulateTyping = (textarea, text) => {
        textarea.value = '';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        for (let char of text) {
            textarea.value += char;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    // Function to create and insert buttons based on userReplies JSON data
    const createButtons = (userRepliesData) => {
        const formElement = document.querySelector(CONFIG.formElementSelector);
        if (!formElement) return;

        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = CONFIG.buttonContainerClass;

        // Create buttons
        userRepliesData.forEach(reply => {
            const button = document.createElement('button');
            button.className = CONFIG.buttonClass;
            button.innerHTML = `
                <span class="emoji">${reply.emoji}</span>
                <span class="prompt" contenteditable="false">${reply.prompt}</span>
                <span class="edit">✏️</span>
            `;

            const editElement = button.querySelector('.edit');
            const promptElement = button.querySelector('.prompt');

            const savePrompt = () => {
                promptElement.contentEditable = 'false';
                editElement.textContent = '✏️';
                reply.prompt = promptElement.textContent; // Update the prompt in the JSON
                // Simulate typing and send the updated prompt
                const textarea = document.querySelector(CONFIG.textareaSelector);
                simulateTyping(textarea, reply.prompt);
                setTimeout(() => {
                    document.querySelector(CONFIG.sendButtonSelector).click();
                }, 200); // Adjust timeout if necessary
                isEditing = false;
            };

            editElement.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent the button click from triggering the edit
                if (promptElement.contentEditable === 'true') {
                    savePrompt();
                } else {
                    isEditing = true;
                    promptElement.contentEditable = 'true';
                    promptElement.focus();
                    editElement.textContent = '💾';
                }
            });

            // Add blur event to save changes
            promptElement.addEventListener('blur', () => {
                if (isEditing) {
                    savePrompt();
                }
            });

            buttonContainer.appendChild(button);
        });

        // Insert the button container before the form element
        formElement.parentNode.insertBefore(buttonContainer, formElement);
    };

    // Function to destroy buttons
    const destroyButtons = () => {
        const buttonContainer = document.querySelector(`.${CONFIG.buttonContainerClass}`);
        if (buttonContainer) {
            buttonContainer.remove();
        }
    };

    // Function to check for userReplies code block
    const checkForUserReplies = () => {
        destroyButtons();
        const elements = document.querySelectorAll('.w-full.text-token-text-primary');
        if (!elements.length) {
            console.log('none');
            return;
        }
        const lastElement = elements[elements.length - 1];
        const userRepliesBlock = lastElement.querySelector('pre code.language-userReplies');
        if (userRepliesBlock) {
            try {
                const userRepliesJson = JSON.parse(userRepliesBlock.textContent);
                console.log(userRepliesJson);
                createButtons(userRepliesJson);
            } catch (e) {
                console.error('Error parsing userReplies JSON:', e);
            }
        } else {
            console.log('none');
        }
    };

    // Function to handle page load and address bar changes
    const handlePageChange = () => {
        setTimeout(checkForUserReplies, CONFIG.checkInterval); // Give some time for content to load
    };

    // Override pushState and replaceState to detect URL changes
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        handlePageChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        handlePageChange();
    };

    // Select the target node
    const targetNode = document.body;

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if the element appears
                const appearingElement = document.querySelector(CONFIG.targetElementSelector);
                if (appearingElement && !elementVisible) {
                    console.log('Element appeared:', appearingElement);
                    elementVisible = true;
                    destroyButtons(); // Destroy buttons when stop button appears
                }

                // Check if the element disappears
                if (!appearingElement && elementVisible) {
                    console.log('Element disappeared');
                    elementVisible = false;
                    // after 50ms check for userReplies code block
                    setTimeout(checkForUserReplies, 50);
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, CONFIG.mutationObserverConfig);

    // Add event listeners for page load and address bar changes
    window.addEventListener('load', handlePageChange);
    window.addEventListener('popstate', handlePageChange);
})();
