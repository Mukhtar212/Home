window.addEventListener('DOMContentLoaded', () => {
  const products = document.querySelector('.products');
  const addCarBtn = document.querySelector('#addCarBtn');
  const modal = document.querySelector('.modal');
  const X = document.querySelector('.X');
  const form = document.querySelector('form');
  const url = 'http://localhost:3000/posts';

  const renderPosts = async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const posts = await res.json();
      products.innerHTML = ''; // Clear the existing content before rendering
      posts.forEach(post => {
        products.innerHTML += `
          <div class="item">
            <div class="delete" id="${post.id}">x</div>
            <div class="title">
              <img src="${post.img}" alt="">
              <div class="information">
                <div><h2>${post.name}</h2></div>
                <div><p>${post.price}</p></div>
                <div class="btn-now"><button>Buy Now</button></div>
              </div>
            </div>
          </div>
        `;
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const AddPost = async (car) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(car),
        headers: {
          "Content-type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add post');
      }

      // After adding the post, re-render the posts
      renderPosts();
    } catch (error) {
      console.error('Error adding post:', error);
    }
  }

  const removePost = async (postId) => {
    try {
      const response = await fetch(`${url}/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // After deleting the post, re-render the posts
      renderPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  addCarBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  X.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = form.querySelector('input[type="file"]');

    const car = {
      name: form.name.value,
      img: '../../assets/img/' + fileInput.files[0].name, // Use just the filename
      price: form.price.value,
    };

    await AddPost(car);

    form.reset();
    modal.style.display = 'none';
  });

  
  products.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('delete')) {
      const postId = e.target.id;
      removePost(postId);
    }
  });

  renderPosts();
});
