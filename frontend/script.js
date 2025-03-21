const contractAddress = "0x4F457c363977E29b614b0eacf4496cCcaa355b40";
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "PostCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "author",
				"type": "address"
			}
		],
		"name": "PostDeleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newTitle",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newContent",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "PostEdited",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_content",
				"type": "string"
			}
		],
		"name": "createPost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "deletePost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_newTitle",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_newContent",
				"type": "string"
			}
		],
		"name": "editPost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getPost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "postCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "posts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let contract;
let accounts;

async function connectWallet() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            accounts = await web3.eth.getAccounts();
            contract = new web3.eth.Contract(contractABI, contractAddress);
            document.getElementById("walletButton").innerText = "Connected";
            document.getElementById("walletButton").classList.add("connected");
            loadUser();
            loadPosts();
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            alert("Failed to connect to wallet. Please try again.");
        }
    } else {
        alert("Install MetaMask to use this platform.");
    }
}

async function loadUser() {
    try {
        let balance = await web3.eth.getBalance(accounts[0]);
        balance = web3.utils.fromWei(balance, "ether");
        document.getElementById("user-info").innerText = `User: ${accounts[0].slice(0,6)}...${accounts[0].slice(-4)} | Balance: ${parseFloat(balance).toFixed(4)} ETH`;
        document.getElementById("user-info").classList.add("visible");
    } catch (error) {
        console.error("Error loading user:", error);
    }
}

async function createPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (!title || !content) {
        alert("Please enter both title and content.");
        return;
    }

    try {
        document.getElementById("publish-btn").disabled = true;
        document.getElementById("publish-btn").innerText = "Publishing...";
        
        await contract.methods.createPost(title, content).send({ from: accounts[0] });
        
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
        alert("Post published successfully!");
        loadPosts();
    } catch (error) {
        console.error("Error creating post:", error);
        alert("Failed to publish post. Please try again.");
    } finally {
        document.getElementById("publish-btn").disabled = false;
        document.getElementById("publish-btn").innerText = "Publish";
    }
}

async function editPost(postId) {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;
    
    const newContent = prompt("Enter new content:");
    if (!newContent) return;
    
    try {
        await contract.methods.editPost(postId, newTitle, newContent).send({ from: accounts[0] });
        alert("Post updated successfully!");
        loadPosts();
    } catch (error) {
        console.error("Error editing post:", error);
        alert("Failed to update post. Please try again.");
    }
}

async function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
        await contract.methods.deletePost(postId).send({ from: accounts[0] });
        alert("Post deleted successfully!");
        loadPosts();
    } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
    }
}

async function loadPosts() {
    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = "<div class='loading'>Loading posts...</div>";
    
    try {
        const postCount = await contract.methods.postCount().call();
        
        if (postCount == 0) {
            postsContainer.innerHTML = "<div class='no-posts'>No posts yet. Be the first to publish!</div>";
            return;
        }
        
        postsContainer.innerHTML = "";
        
        for (let i = 0; i < postCount; i++) {
            try {
                const post = await contract.methods.getPost(i).call();
                
                // Skip posts that might have been deleted
                if (post[1] === "0x0000000000000000000000000000000000000000") continue;
                
                const postElement = document.createElement("div");
                postElement.className = "post";
                
                const isAuthor = post[1].toLowerCase() === accounts[0].toLowerCase();
                const dateTime = new Date(post[4] * 1000).toLocaleString();
                
                postElement.innerHTML = `
                    <h3>${post[2]}</h3>
                    <div class="post-content">${post[3]}</div>
                    <div class="post-meta">
                        <span class="author">Author: ${post[1].slice(0,6)}...${post[1].slice(-4)}</span>
                        <span class="timestamp">Posted: ${dateTime}</span>
                    </div>
                    <div class="post-actions">
                        ${isAuthor ? `
                            <button class="edit-btn" onclick="editPost(${post[0]})">✏️ Edit</button>
                            <button class="delete-btn" onclick="deletePost(${post[0]})">🗑️ Delete</button>
                        ` : ''}
                    </div>
                `;
                
                postsContainer.appendChild(postElement);
            } catch (error) {
                console.error(`Error loading post ${i}:`, error);
            }
        }
        
        if (postsContainer.innerHTML === "") {
            postsContainer.innerHTML = "<div class='no-posts'>No posts available.</div>";
        }
        
    } catch (error) {
        console.error("Error loading posts:", error);
        postsContainer.innerHTML = "<div class='error'>Failed to load posts. Please try again later.</div>";
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
    
    const themeIcon = document.getElementById("theme-icon");
    if (document.body.classList.contains("dark-mode")) {
        themeIcon.textContent = "🌙";
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.textContent = "☀️";
        localStorage.setItem("theme", "light");
    }
}

// Set up event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Connect wallet button
    const walletButton = document.getElementById("walletButton");
    if (walletButton) {
        walletButton.addEventListener("click", connectWallet);
    }
    
    // Publish button
    const publishButton = document.getElementById("publish-btn");
    if (publishButton) {
        publishButton.addEventListener("click", createPost);
    }
    
    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }
    
    // Set theme based on localStorage or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
        if (document.getElementById("theme-icon")) {
            document.getElementById("theme-icon").textContent = "☀️";
        }
    } else {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
        if (document.getElementById("theme-icon")) {
            document.getElementById("theme-icon").textContent = "🌙";
        }
    }
    
    // Auto-connect if previously connected
    if (window.ethereum && window.ethereum.isConnected()) {
        connectWallet();
    }
});

// Handle account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        connectWallet();
    });
    
    window.ethereum.on('chainChanged', function (chainId) {
        window.location.reload();
    });
}
