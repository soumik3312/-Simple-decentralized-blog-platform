// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DecentralizedBlog {
    struct BlogPost {
        uint id;
        address author;
        string title;
        string content;
        uint timestamp;
    }

    mapping(uint => BlogPost) public posts;
    uint public postCount;

    event PostCreated(uint id, address author, string title, uint timestamp);
    event PostEdited(uint id, string newTitle, string newContent, uint timestamp);
    event PostDeleted(uint id, address author);

    /// @notice Create a new blog post
    function createPost(string memory _title, string memory _content) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_content).length > 0, "Content cannot be empty");

        postCount++;
        posts[postCount] = BlogPost(postCount, msg.sender, _title, _content, block.timestamp);

        emit PostCreated(postCount, msg.sender, _title, block.timestamp);
    }

    /// @notice Edit an existing post (only the author can edit)
    function editPost(uint _id, string memory _newTitle, string memory _newContent) public {
        require(_id > 0 && _id <= postCount, "Post does not exist");
        BlogPost storage post = posts[_id];
        require(msg.sender == post.author, "Only the author can edit this post");

        post.title = _newTitle;
        post.content = _newContent;
        post.timestamp = block.timestamp;

        emit PostEdited(_id, _newTitle, _newContent, block.timestamp);
    }

    /// @notice Delete a post (only the author can delete)
    function deletePost(uint _id) public {
        require(_id > 0 && _id <= postCount, "Post does not exist");
        BlogPost storage post = posts[_id];
        require(msg.sender == post.author, "Only the author can delete this post");

        delete posts[_id];

        emit PostDeleted(_id, msg.sender);
    }

    /// @notice Retrieve a specific post
    function getPost(uint _id) public view returns (uint, address, string memory, string memory, uint) {
        require(_id > 0 && _id <= postCount, "Post does not exist");
        BlogPost memory post = posts[_id];
        return (post.id, post.author, post.title, post.content, post.timestamp);
    }
}
