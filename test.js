async function test() {
  try {
    console.log('--- Testing /addSchool ---');
    const addRes1 = await fetch('https://node-rfbi.onrender.com/addSchool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Green Valley School',
        address: '123 Main St',
        latitude: 37.5,
        longitude: -122.1
      })
    });
    console.log('Add School 1 Response:', await addRes1.json());

    const addRes2 = await fetch('https://node-rfbi.onrender.com/addSchool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Riverside High',
        address: '456 River Rd',
        latitude: 37.8,
        longitude: -122.4
      })
    });
    console.log('Add School 2 Response:', await addRes2.json());

    console.log('\n--- Testing /listSchools ---');
    console.log('Finding schools near 37.6, -122.2');
    const listRes = await fetch('https://node-rfbi.onrender.com/listSchools?latitude=37.6&longitude=-122.2');
    const schoolsList = await listRes.json();
    console.log('List Schools Response:');
    console.table(schoolsList);

    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Give the server a moment to init DB before testing
setTimeout(test, 2000);
