// Простой тест API калькулятора
async function testCalculatorAPI() {
  try {
    console.log('Тестируем GET запрос...');
    const getResponse = await fetch('/api/calculator?language=RU');
    const getData = await getResponse.json();
    console.log('GET Response:', getData);

    if (getData.ok) {
      console.log('GET запрос успешен!');
      
      // Тестируем POST запрос
      console.log('Тестируем POST запрос...');
      const testData = {
        language: 'RU',
        sections: [
          { key: 'websiteType', label: 'Тип сайта', icon: '' },
          { key: 'complexity', label: 'Сложность', icon: '' }
        ],
        websiteType: {
          'landing': { label: 'Лендинг', price: 500, multiplier: 1, priceType: 'fixed' },
          'corporate': { label: 'Корпоративный сайт', price: 1200, multiplier: 1, priceType: 'fixed' }
        },
        complexity: {
          'simple': { label: 'Простой', price: 0, multiplier: 1, priceType: 'multiplier' },
          'medium': { label: 'Средний', price: 0, multiplier: 1.5, priceType: 'multiplier' }
        }
      };

      const postResponse = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const postData = await postResponse.json();
      console.log('POST Response:', postData);

      if (postData.ok) {
        console.log('POST запрос успешен!');
      } else {
        console.error('POST запрос неуспешен:', postData);
      }
    } else {
      console.error('GET запрос неуспешен:', getData);
    }
  } catch (error) {
    console.error('Ошибка при тестировании API:', error);
  }
}

// Запускаем тест
testCalculatorAPI();
