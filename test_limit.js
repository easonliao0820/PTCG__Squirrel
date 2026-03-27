const baseUrl = 'http://localhost:3000/api/activities';

async function testLimit() {
  try {
    const res = await fetch(`${baseUrl}?limit=10`);
    const data = await res.json();
    if (data.data.length < 6) {
      console.log('Not enough activities to test limit.');
      return;
    }

    const ids = data.data.slice(0, 6).map(item => item.id);
    console.log('Trying to toggle ON for:', ids);

    for (let i = 0; i < ids.length; i++) {
        const toggleOn = await fetch(`${baseUrl}/toggle-top`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activityId: ids[i], isTop: true })
        });
        const onData = await toggleOn.json();
        console.log(`ID ${ids[i]} toggle result:`, toggleOn.status, onData);
    }

    // Cleanup
    for (const id of ids) {
        await fetch(`${baseUrl}/toggle-top`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activityId: id, isTop: false })
        });
    }
  } catch (err) {
    console.error('Limit test failed:', err);
  }
}

testLimit();
