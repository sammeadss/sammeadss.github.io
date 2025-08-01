class TerminalPortfolio {
    constructor() {
        this.terminalContent = document.getElementById('terminal-content');
        this.commandInput = null;
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.commands = {
            'help': this.showHelp.bind(this),
            'whoami': this.showWhoami.bind(this),
            'ls': this.showDirectory.bind(this),
            'cat': this.showFile.bind(this),
            'clear': this.clearTerminal.bind(this),
            'projects': this.showProjects.bind(this),
            'certifications': this.showCertifications.bind(this),
            'resume': this.showResume.bind(this),
            'download': this.downloadResume.bind(this),
            'contact': this.showContact.bind(this),
            'about': this.showAbout.bind(this),
            'skills': this.showSkills.bind(this),
            'education': this.showEducation.bind(this)
        };
        
        this.init();
    }
    
    init() {
        this.showWelcome();
    }
    
        showWelcome() {
        const welcomeText = `
===============================================================================
=    W e l c o m e   t o   M y   P o r t f o l i o    -    Version 1.0        =
===============================================================================
  `;
        this.typeText(welcomeText, () => {
            this.createNewInputPrompt();
        });
    }
    
    processCommand() {
        const command = this.commandInput.value.trim().toLowerCase();
        this.commandInput.value = '';
        
        if (command === '') return;
        
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        this.printCommand(`sammeads@personal-portfolio:~$ ${command}`);
        
        const [cmd, ...args] = command.split(' ');
        
        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.printOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        }
        
        this.createNewInputPrompt();
    }
    
    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.commandInput.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.commandInput.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex++;
            this.commandInput.value = '';
        }
    }
    
    printCommand(command) {
        const commandDiv = document.createElement('div');
        commandDiv.className = 'command-line';
        commandDiv.textContent = command;
        this.terminalContent.appendChild(commandDiv);
        this.scrollToBottom();
    }
    
    printOutput(text, type = 'normal') {
        const outputDiv = document.createElement('div');
        outputDiv.className = `output-text ${type}`;
        outputDiv.innerHTML = text.replace(/\n/g, '<br>');
        this.terminalContent.appendChild(outputDiv);
        this.scrollToBottom();
    }
    
    typeText(text, callback) {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'output-text typing';
        this.terminalContent.appendChild(outputDiv);
        
        let i = 0;
        const typeInterval = setInterval(() => {
            outputDiv.textContent = text.substring(0, i);
            i++;
            
            if (i > text.length) {
                clearInterval(typeInterval);
                outputDiv.classList.remove('typing');
                if (callback) callback();
            }
        }, 10);
    }
    
    scrollToBottom() {
        this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
    }
    
    setupInputListener(inputElement) {
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.processCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });
    }
    
    createNewInputPrompt() {
        const oldInputLine = this.terminalContent.querySelector('.terminal-input-line');
        if (oldInputLine) {
            oldInputLine.remove();
        }
        
        const newInputLine = document.createElement('div');
        newInputLine.className = 'terminal-input-line';
        newInputLine.innerHTML = `
            <span class="prompt">sammeads@personal-portfolio:~$</span>
            <input type="text" class="command-input" placeholder="Type 'help' for available commands" autocomplete="off">
        `;
        
        this.terminalContent.appendChild(newInputLine);
        
        const newInput = newInputLine.querySelector('.command-input');
        this.commandInput = newInput;
        this.setupInputListener(newInput);
        
        newInput.focus();
        
        this.scrollToBottom();
    }
    
    showHelp() {
        const helpText = `
Available commands:
├── whoami          - About me
├── ls              - List directory contents
├── cat <file>      - Display file contents
├── projects        - Show my projects
├── certifications  - Show certifications
├── resume          - View resume
├── download        - Download resume PDF
├── contact         - Contact information
├── skills          - Technical skills
├── education       - Educational background
├── about           - About this site
├── clear           - Clear terminal
└── help            - Show this help

Examples:
  cat resume
  ls projects
  whoami
  skills
`;
        this.printOutput(helpText);
    }
    
    showWhoami() {
        const whoamiText = `
Samuel Meads
├── Name: Samuel Meads
├── Major: B.S. in Computer Science, Minor in Mathematics
├── Location: Miami, FL
├── Interests: IT, Security, Networking, Scripting, AI, Automation
├── Status: Actively seeking internships 
└── Skills: Bash, Python, Networking, Security Tools

I'm passionate about cybersecurity and information technology.
Currently pursuing my degree while building practical skills
through projects, certifications, and hands-on experience.
`;
        this.printOutput(whoamiText);
    }
    
    showDirectory() {
        const dirText = `
total 10
drwxr-xr-x  2 sammeads  staff   68 Dec 20 10:00 .
drwxr-xr-x  2 sammeads  staff   68 Dec 20 10:00 ..
-rw-r--r--  1 sammeads  staff  512 Dec 20 10:00 resume.txt
-rw-r--r--  1 sammeads  staff  256 Dec 20 10:00 projects/
-rw-r--r--  1 sammeads  staff  128 Dec 20 10:00 certifications/
-rw-r--r--  1 sammeads  staff  128 Dec 20 10:00 contact.txt
-rw-r--r--  1 sammeads  staff  128 Dec 20 10:00 skills.txt
-rw-r--r--  1 sammeads  staff  256 Dec 20 10:00 assets/
`;
        this.printOutput(dirText);
    }
    
    showFile(args) {
        if (args.length === 0) {
            this.printOutput('Usage: cat <filename>', 'error');
            return;
        }
        
        const file = args[0];
        
        switch (file) {
            case 'resume':
            case 'resume.txt':
                this.showResume();
                break;
            case 'resume.pdf':
                this.downloadResume();
                break;
            case 'contact':
            case 'contact.txt':
                this.showContact();
                break;
            case 'skills':
            case 'skills.txt':
                this.showSkills();
                break;
            default:
                this.printOutput(`File not found: ${file}`, 'error');
        }
    }
    
    showProjects() {
        const projectsText = `
PROJECTS
========

`;
        this.printOutput(projectsText);
    }
    
    showCertifications() {
        const certText = `
CERTIFICATIONS
==============

• CompTIA A+
• CompTIA Security+ (In Progress)
• CompTIA Network+ (In Progress)
• CodePath Intermediate Cybersecurity

`;
        this.printOutput(certText);
    }
    
    showResume() {
        const resumeText = `
RESUME - Samuel Meads
=====================

EDUCATION
---------
• University of Miami - Bachelor of Science in Computer Science
• Minor: Mathematics
• Expected Graduation: 2026
• GPA: 2.97

SKILLS
------
• Programming: Python, Bash, JavaScript, SQL
• Security: Network Security, Penetration Testing, Incident Response
• Tools: Wireshark, Nmap, Metasploit, Burp Suite
• Operating Systems: Linux (Ubuntu, Kali, ParrotOS), Windows
• Networking: TCP/IP, DNS, DHCP, VPN, Firewalls

PROJECTS
---------

CERTIFICATIONS
--------------
• CompTIA A+
• CompTIA Security+ (In Progress)
• CompTIA Network+ (In Progress)
• CodePath Intermediate Cybersecurity

DOWNLOAD RESUME
---------------
Download PDF: <a href="assets/resume.pdf" target="_blank" style="color: #00ff00; text-decoration: underline;">resume.pdf</a>

[Click the link above to download my resume as a PDF]
`;
        this.printOutput(resumeText);
    }
    
    downloadResume() {
        const downloadText = `
DOWNLOADING RESUME...
====================

Initiating download of resume.pdf...
Opening: assets/resume.pdf

If download doesn't start automatically, click here:
<a href="assets/resume.pdf" download="Samuel_Meads_Resume.pdf" style="color: #00ff00; text-decoration: underline;">Download Resume PDF</a>

Resume Details:
├── Format: PDF
├── Filename: Meads_Samuel_Resume.pdf
├── Size:
└── Last Updated:

[The download should start automatically in a new tab]
`;
        this.printOutput(downloadText);
        
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = 'assets/resume.pdf';
            link.download = 'Meads_Samuel_Resume.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 1000);
    }
    
    showContact() {
        const contactText = `
CONTACT INFORMATION
===================

• Email: []
• LinkedIn: []
• GitHub: [github.com/sammeadss]
• Portfolio: https://sammeadss.github.io

[Update with your actual contact information]
`;
        this.printOutput(contactText);
    }
    
    showSkills() {
        const skillsText = `
TECHNICAL SKILLS
================

`;
        this.printOutput(skillsText);
    }
    
    showEducation() {
        const eduText = `
EDUCATION
==========

University of Miami
├── Degree: Bachelor of Science (B.S.)
├── Major: Computer Science
├── Minor: Mathematics
├── Expected Graduation: 2026
├── GPA: 2.97
└── Relevant Coursework:
    ├── Cybersecurity
    ├── System Programming
    ├── Computer Organization and Architecture
    ├── Data Structures and Algorithms
    ├── Database Systems
    ├── Theory of Computing 
    ├── Python Programming
    ├── Computer Programming I 
    └── Computer Programming II
`;
        this.printOutput(eduText);
    }
    
    showAbout() {
        const aboutText = `
ABOUT THIS SITE
===============


`;
        this.printOutput(aboutText);
    }
    
    clearTerminal() {
        this.terminalContent.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TerminalPortfolio();
}); 