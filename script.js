                          // Array to store recently added channels
        const recentlyAddedChannels = [];

        // Function to add a channel to the "Recently Added" section
        function addToRecentlyAdded(channel) {
            // Ensure no more than 20 channels are stored
            if (recentlyAddedChannels.length >= 20) {
                recentlyAddedChannels.shift(); // Remove the oldest channel if we have 20 already
            }
            recentlyAddedChannels.push(channel);
            updateRecentlyAddedSection();  // Update the "Recently Added" section
        }

        // Function to update the "Recently Added Channels" section
        function updateRecentlyAddedSection() {
            const container = document.getElementById("recently-added-container");
            container.innerHTML = '';  // Clear current content

            recentlyAddedChannels.forEach(channel => {
                const videoElement = document.createElement("div");
                videoElement.classList.add("video");
                videoElement.innerHTML = `
                    <img src="${channel.imgSrc}" alt="${channel.title}">
                    <h3>${channel.title}</h3>
                    <button onclick="openVideo('${channel.url}')">Play</button>
                `;
                container.appendChild(videoElement);
            });
        }

        


// Function to perform search on video items
        function performSearch() {
            const searchQuery = document.getElementById("search-input").value.toLowerCase();
            const videos = document.querySelectorAll(".video");
            let resultsFound = false;

           

 // Loop through each video and check if the title or data attributes match the search query
            videos.forEach(video => {
                const title = video.querySelector("h3").textContent.toLowerCase();
                const category = video.getAttribute("data-category").toLowerCase();
                const language = video.getAttribute("data-language").toLowerCase();
                const country = video.getAttribute("data-country").toLowerCase();

                

// Check if search query matches title, category, language, or country
                if (title.includes(searchQuery) || category.includes(searchQuery) || language.includes(searchQuery) || country.includes(searchQuery)) {
                    video.style.display = "block";  

// Show the video if it matches
                    resultsFound = true;
                } else {
                    video.style.display = "none";  

// Hide the video if it doesn't match
                }
            });

            

// Display the "No Results Found" message if no results were found
            const noResultsMessage = document.getElementById("noResultsMessage");
            if (resultsFound) {
                noResultsMessage.style.display = "none";
            } else {
                noResultsMessage.style.display = "block";
            }
        }            
          function openVideo(url) {
            window.location.href = `play.html?video=${encodeURIComponent(url)}`;
        }

        

// Function for scrolling videos left and right
        document.querySelectorAll('.arrow-left').forEach(arrow => {
            arrow.addEventListener('click', function () {
                const container = this.closest('.section').querySelector('.video-container');
                container.scrollBy({ left: -200, behavior: 'smooth' });
            });
        });

        document.querySelectorAll('.arrow-right').forEach(arrow => {
            arrow.addEventListener('click', function () {
                const container = this.closest('.section').querySelector('.video-container');
                container.scrollBy({ left: 200, behavior: 'smooth' });
            });
        });
        




