// Quick seed script for local development
const BASE = 'http://localhost:5000/api';

async function seed() {
    console.log('🌱 Seeding database...\n');

    // 1. Register vendor
    console.log('1️⃣ Registering vendor...');
    const vendorRes = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'QuickFix Plumbing',
            email: 'vendor@test.com',
            password: '123456',
            phone: '+91 9988776655',
            role: 'vendor',
        }),
    });
    const vendorData = await vendorRes.json();
    if (!vendorRes.ok && !vendorData.message?.includes('exists')) {
        console.log('  Vendor may already exist, trying login...');
    }

    // Login vendor
    const loginRes = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'vendor@test.com', password: '123456' }),
    });
    const loginData = await loginRes.json();
    const vendorToken = loginData.token;
    console.log('  ✅ Vendor logged in');

    // 2. Update vendor profile
    console.log('2️⃣ Updating vendor profile...');
    const profileRes = await fetch(`${BASE}/vendors/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${vendorToken}` },
        body: JSON.stringify({
            businessName: 'QuickFix Plumbing',
            description: 'Expert plumbing services with 10+ years experience.',
            categories: ['Plumber'],
            location: { type: 'Point', coordinates: [77.209, 28.6139] },
            address: 'Connaught Place, New Delhi',
            availability: {
                monday: [{ start: '09:00', end: '18:00' }],
                tuesday: [{ start: '09:00', end: '18:00' }],
                wednesday: [{ start: '09:00', end: '18:00' }],
                thursday: [{ start: '09:00', end: '18:00' }],
                friday: [{ start: '09:00', end: '18:00' }],
                saturday: [{ start: '10:00', end: '14:00' }],
                sunday: [],
            },
        }),
    });
    const profileData = await profileRes.json();
    const vendorProfileId = profileData?.data?._id;
    console.log('  ✅ Profile updated, ID:', vendorProfileId);

    // 3. Add services
    console.log('3️⃣ Adding services...');
    const services = [
        { name: 'Pipe Repair', description: 'Fix leaky or burst pipes', price: 350, duration: 60, category: 'Plumber' },
        { name: 'Drain Cleaning', description: 'Unclog blocked drains', price: 250, duration: 45, category: 'Plumber' },
        { name: 'Full Bathroom Fitting', description: 'Complete bathroom plumbing', price: 5000, duration: 480, category: 'Plumber' },
    ];
    for (const svc of services) {
        await fetch(`${BASE}/vendors/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${vendorToken}` },
            body: JSON.stringify(svc),
        });
        console.log(`  ✅ ${svc.name} added`);
    }

    // 4. Register admin & approve vendor
    console.log('4️⃣ Registering admin...');
    await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Admin', email: 'admin@test.com', password: 'admin123', phone: '+91 9000000000', role: 'admin' }),
    });
    const adminLogin = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@test.com', password: 'admin123' }),
    });
    const adminData = await adminLogin.json();
    console.log('  ✅ Admin logged in');

    // Approve vendor
    console.log('5️⃣ Approving vendor...');
    const approveRes = await fetch(`${BASE}/admin/vendors/${vendorProfileId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminData.token}` },
    });
    const approveData = await approveRes.json();
    console.log('  ✅ Vendor approved:', approveData?.data?.verified);

    // 5. Register customer
    console.log('6️⃣ Registering customer...');
    await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Deepanshu', email: 'deepanshu@test.com', password: '123456', phone: '+91 9876543210', role: 'customer' }),
    });
    console.log('  ✅ Customer registered');

    console.log('\n🎉 Seed complete! Test accounts:');
    console.log('  Customer: deepanshu@test.com / 123456');
    console.log('  Vendor:   vendor@test.com / 123456');
    console.log('  Admin:    admin@test.com / admin123');
}

seed().catch(console.error);
