document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle with localStorage persistence
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  // Apply saved theme on load
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon();
  }

  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-theme')) {
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
    }
  }

  // Copy button functionality
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', function() {
      const codeContainer = this.closest('.code-container');
      const codeText = codeContainer.querySelector('.editable-code').value;
      navigator.clipboard.writeText(codeText).then(() => {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 2000);
      });
    });
  });

  // Reset button functionality
  document.querySelectorAll('.reset-button').forEach(button => {
    button.addEventListener('click', function() {
      const codeContainer = this.closest('.code-container');
      const textarea = codeContainer.querySelector('.editable-code');
      const originalCode = textarea.dataset.original || textarea.value;
      textarea.value = originalCode;
      
      const outputPanel = this.closest('.example-container').querySelector('.output-text');
      outputPanel.textContent = 'Click "Run Code" to see output';
    });
  });

  // Run button functionality with Piston API
  document.querySelectorAll('.run-button').forEach(button => {
    button.addEventListener('click', async function() {
      const exampleContainer = this.closest('.example-container');
      let code = exampleContainer.querySelector('.editable-code').value;
      const outputPanel = exampleContainer.querySelector('.output-text');
      
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
      
      try {
        // Process input() calls
        const inputRegex = /input\(([^)]*)\)/g;
        let match;
        let modifiedCode = code;
        let inputCount = 0;
        
        while ((match = inputRegex.exec(code)) !== null) {
          inputCount++;
          const promptMessage = match[1].replace(/['"]/g, '') || `Enter input #${inputCount}`;
          let userInput = prompt(promptMessage);
          
          if (userInput === null) {
            throw new Error("Input cancelled by user");
          }
          
          // Handle type conversions
          if (code.includes(`int(${match[0]})`)) {
            while (isNaN(userInput)) {
              userInput = prompt(`Please enter a valid number for: ${promptMessage}`);
              if (userInput === null) {
                throw new Error("Input cancelled by user");
              }
            }
            modifiedCode = modifiedCode.replace(`int(${match[0]})`, userInput);
          } else if (code.includes(`float(${match[0]})`)) {
            while (isNaN(userInput)) {
              userInput = prompt(`Please enter a valid number for: ${promptMessage}`);
              if (userInput === null) {
                throw new Error("Input cancelled by user");
              }
            }
            modifiedCode = modifiedCode.replace(`float(${match[0]})`, userInput);
          } else {
            modifiedCode = modifiedCode.replace(match[0], `"${userInput}"`);
          }
        }
        
        const response = await executeCode(modifiedCode);
        outputPanel.textContent = response.run.output || "No output";
        if (response.run.stderr) {
          outputPanel.textContent += "\nError: " + response.run.stderr;
        }
      } catch (error) {
        outputPanel.textContent = "Error: " + error.message;
      } finally {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-play"></i> Run Code';
      }
    });
  });

  // Store original code when page loads
  document.querySelectorAll('.editable-code').forEach(textarea => {
    textarea.dataset.original = textarea.value;
  });
});

async function executeCode(code) {
  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      language: 'python',
      version: '3.10.0',
      files: [{
        content: code
      }]
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to execute code');
  }
  
  return await response.json();
}
