const API_URL = "https://api.github.com/users/";

let currentPage = 1; // Uncomment this line or declare globally
let perPage = 10;
let searchQuery = "";
let totalRepositories = 0;

function getRepositories() {
  const username = document.getElementById("username").value;
  searchQuery = document.getElementById("search").value;
  const repositoriesContainer = document.getElementById("repositories");
  const loader = document.getElementById("loader");

  // Reset current page when searching
  currentPage = 1;

  // Display loader while API call is in progress
  loader.style.display = "block";

  // Fetch repositories using GitHub API with pagination and search parameters
  fetch(
    `${API_URL}${username}/repos?per_page=${perPage}&page=${currentPage}&q=${searchQuery}`
  )
    .then((response) => response.json())
    .then((repositories) => {
      loader.style.display = "none";
      totalRepositories = repositories.length;

      // Display repositories
      displayRepositories(repositories, repositoriesContainer);
    })
    .catch((error) => {
      console.error("Error fetching repositories:", error);
      loader.style.display = "none";
      repositoriesContainer.innerHTML =
        "Error fetching repositories. Please try again.";
    });
}

function displayRepositories(repositories, container) {
  // Clear existing content
  container.innerHTML = "";

  // Display repositories for the current page
  for (let i = 0; i < repositories.length; i++) {
    const repo = repositories[i];
    const repoCard = document.createElement("div");
    repoCard.className = "card mt-3";
    repoCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${repo.name}</h5>
                <p class="card-text">${
                  repo.description || "No description available"
                }</p>
                <a href="${
                  repo.html_url
                }" class="btn btn-primary" target="_blank">Go to Repository</a>
            </div>
        `;
    container.appendChild(repoCard);
  }

  // Show or hide the "Load More" button based on the number of repositories
  document.getElementById("pagination").innerHTML = generatePagination();
}

function generatePagination() {
  const totalPages = Math.ceil(totalRepositories / perPage);

  let paginationHTML = `<nav aria-label="...">
                            <ul class="pagination">`;

  // Previous Page
  paginationHTML += `<li class="page-item ${
    currentPage === 1 ? "disabled" : ""
  }">
                        <a class="page-link" href="#" onclick="changePage(${
                          currentPage - 1
                        })" tabindex="-1">Previous</a>
                    </li>`;

  // Page numbers
  for (let page = 1; page <= totalPages; page++) {
    paginationHTML += `<li class="page-item ${
      currentPage === page ? "active" : ""
    }">
                            <a class="page-link" href="#" onclick="changePage(${page})">${page}</a>
                        </li>`;
  }

  // Next Page
  paginationHTML += `<li class="page-item ${
    currentPage === totalPages ? "disabled" : ""
  }">
                        <a class="page-link" href="#" onclick="changePage(${
                          currentPage + 1
                        })">Next</a>
                    </li>`;

  paginationHTML += `</ul>
                    </nav>`;

  return paginationHTML;
}

function changePage(newPage) {
  const totalPages = Math.ceil(totalRepositories / perPage);

  // Ensure the new page is within valid bounds
  if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
    currentPage = newPage;
    getRepositories();
  }
}

