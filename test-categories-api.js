// Test the categories API endpoint
fetch('http://localhost:3000/api/categories')
  .then(res => res.json())
  .then(data => console.log('Categories API Response:', JSON.stringify(data, null, 2)))
  .catch(err => console.error('Error:', err));
