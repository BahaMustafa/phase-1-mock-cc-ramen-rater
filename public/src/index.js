document.addEventListener("DOMContentLoaded", () => {
  const ramenMenu = document.querySelector("#ramen-menu");
  const ramenDetail = document.querySelector("#ramen-detail");
  const newRamenForm = document.querySelector("#new-ramen");
  const deleteButton = document.querySelector("#delete-button");

  fetch("http://localhost:3000/ramens")
    .then(response => response.json())
    .then(ramens => {
      ramens.forEach(ramen => {
        const img = document.createElement("img");
        img.src = ramen.image;
        img.dataset.id = ramen.id;
        img.addEventListener("click", handleImageClick);
        ramenMenu.appendChild(img);
      });
      // Load the first ramen details
      handleImageClick({ target: ramenMenu.querySelector("img") });
    });

  function handleImageClick(event) {
    const id = event.target.dataset.id;
    fetch(`http://localhost:3000/ramens/${id}`)
      .then(response => response.json())
      .then(ramen => {
        ramenDetail.querySelector(".detail-image").src = ramen.image;
        ramenDetail.querySelector(".name").textContent = ramen.name;
        ramenDetail.querySelector(".restaurant").textContent = ramen.restaurant;
        document.querySelector("#rating-display").textContent = ramen.rating;
        document.querySelector("#comment-display").textContent = ramen.comment;
        deleteButton.dataset.id = ramen.id; // Store ramen id for deleting
      });
  }

  newRamenForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newRamen = {
      name: formData.get("name"),
      restaurant: formData.get("restaurant"),
      image: formData.get("image"),
      rating: formData.get("rating"),
      comment: formData.get("new-comment"),
    };
    const img = document.createElement("img");
    img.src = newRamen.image;
    img.addEventListener("click", handleImageClick);
    ramenMenu.appendChild(img);
    event.target.reset();
  });

  deleteButton.addEventListener("click", event => {
    const id = event.target.dataset.id;
    fetch(`http://localhost:3000/ramens/${id}`, {
      method: "DELETE",
    }).then(response => {
      if (response.ok) {
        // Remove ramen image from the menu
        const img = ramenMenu.querySelector(`img[data-id='${id}']`);
        ramenMenu.removeChild(img);
        // Clear ramen details
        ramenDetail.querySelector(".detail-image").src = "";
        ramenDetail.querySelector(".name").textContent = "";
        ramenDetail.querySelector(".restaurant").textContent = "";
        document.querySelector("#rating-display").textContent = "";
        document.querySelector("#comment-display").textContent = "";
      }
    });
  });
});

