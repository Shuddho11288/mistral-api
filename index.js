// Import axios library for making HTTP requests
const axios = require('axios')

// Export the mistral function
module.exports = {
    mistral: async (prompt, stream=false)=>{
        // Define the data payload for the API request
        const data = {
            "input": {
                "top_p": 0.9, // Top probability for token sampling
                "prompt": prompt, // User input prompt
                "temperature": 0.6, // Sampling temperature
                "system_prompt": "You are a very helpful, respectful and honest assistant.", // System prompt
                "length_penalty": 1, // Length penalty
                "max_new_tokens": 512, // Maximum number of tokens to generate
                "prompt_template": "<s>[INST] {prompt} [/INST] ", // Prompt template
                "presence_penalty": 0 // Presence penalty
            },
            "stream": stream // Option to stream the response
        }

        // Make a POST request to the Mistral API to generate predictions
        let response = await axios.post('https://replicate.com/api/models/mistralai/mistral-7b-instruct-v0.2/predictions', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Fetch the generated predictions using the task ID
        let ndata = await axios.get(`https://replicate.com/api/predictions/${response.data.id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Return the data including the final result
        return {...ndata.data, final_result: ndata.data.output.join('')}
    }
}
