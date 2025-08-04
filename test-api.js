const axios = require('axios');

const API_BASE = 'http://54.198.228.118:3000/api/employees';

async function testAPI() {
  console.log('🧪 Testing Employee Management API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get('http://54.198.228.118:3000/health');
    console.log('✅ Health check passed:', health.data);

    // Test 2: Get all employees
    console.log('\n2. Testing GET /api/employees...');
    const employees = await axios.get(API_BASE);
    console.log('✅ Retrieved employees:', employees.data.length);

    // Test 3: Create employee
    console.log('\n3. Testing POST /api/employees...');
    const newEmployee = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'Engineering'
    };
    const created = await axios.post(API_BASE, newEmployee);
    console.log('✅ Created employee:', created.data);

    // Test 4: Get employee by ID
    console.log('\n4. Testing GET /api/employees/:id...');
    const employee = await axios.get(`${API_BASE}/${created.data.id}`);
    console.log('✅ Retrieved employee:', employee.data);

    // Test 5: Update employee
    console.log('\n5. Testing PUT /api/employees/:id...');
    const updated = await axios.put(`${API_BASE}/${created.data.id}`, {
      name: 'John Smith',
      email: 'john.smith@example.com',
      department: 'Engineering'
    });
    console.log('✅ Updated employee:', updated.data);

    // Test 6: Delete employee
    console.log('\n6. Testing DELETE /api/employees/:id...');
    const deleted = await axios.delete(`${API_BASE}/${created.data.id}`);
    console.log('✅ Deleted employee:', deleted.data);

    // Test 7: Validation error
    console.log('\n7. Testing validation error...');
    try {
      await axios.post(API_BASE, { name: 'Invalid' });
    } catch (error) {
      console.log('✅ Validation error caught:', error.response.data.error);
    }

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 