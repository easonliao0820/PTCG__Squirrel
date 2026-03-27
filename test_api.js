const baseUrl = 'http://localhost:3000/api/activities';

async function test() {
  try {
    // 1. Get current activities
    const res = await fetch(`${baseUrl}?limit=1`);
    const data = await res.json();
    if (!data.data || data.data.length === 0) {
      console.log('No activities found to test with.');
      return;
    }
    const targetId = data.data[0].id;
    console.log(`Testing with activity ID: ${targetId}`);

    // 2. Toggle Top ON
    const toggleOn = await fetch(`${baseUrl}/toggle-top`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityId: targetId, isTop: true })
    });
    console.log('Toggle Top ON status:', toggleOn.status);
    const onData = await toggleOn.json();
    console.log('Toggle Top ON result:', onData);

    // 3. Verify in list
    const res2 = await fetch(`${baseUrl}?limit=1`);
    const data2 = await res2.json();
    console.log('Is Top after toggle:', data2.data[0].isTop);

    // 4. Toggle Top OFF
    const toggleOff = await fetch(`${baseUrl}/toggle-top`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityId: targetId, isTop: false })
    });
    console.log('Toggle Top OFF status:', toggleOff.status);
    const offData = await toggleOff.json();
    console.log('Toggle Top OFF result:', offData);

  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
