import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import { generateBeautyConsultation, generateGlowBotReply, generateStyleRecommendations } from './server/ai';
import { Appointment, Review, Service, Beautician, Parlor } from './src/types';
import {
  getSupabaseClient,
  testSupabaseConnection,
  getSupabaseStatus,
  getSupabaseConfig,
  SUPABASE_SQL_SCHEMA
} from './server/supabase';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  // Initialize Supabase background check
  testSupabaseConnection().then(res => {
    console.log(`🔌 Supabase (${res.projectId}) status:`, res.connected ? 'Connected' : 'Offline / In-Memory Fallback Active');
  }).catch(err => {
    console.warn('Supabase connection initial check:', err.message);
  });

  // --- API ROUTES ---

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Supabase Database Connection & Integration Endpoints
  app.get('/api/supabase/status', async (req: Request, res: Response) => {
    const result = await testSupabaseConnection();
    res.json(result);
  });

  app.post('/api/supabase/test', async (req: Request, res: Response) => {
    const result = await testSupabaseConnection();
    res.json(result);
  });

  app.get('/api/supabase/schema', (req: Request, res: Response) => {
    const config = getSupabaseConfig();
    res.json({
      projectId: config.projectId,
      url: config.url,
      schema: SUPABASE_SQL_SCHEMA
    });
  });

  app.post('/api/supabase/seed', async (req: Request, res: Response) => {
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: 'Supabase client not initialized' });
    }

    try {
      const results: Record<string, any> = {};

      // Seed parlors if table exists
      try {
        const parlorsData = db.parlors.map(p => ({
          id: p.id,
          name: p.name,
          tagline: p.tagline,
          description: p.description,
          address: p.address,
          city: p.city,
          state: p.state,
          pincode: p.pincode,
          phone: p.phone,
          email: p.email,
          images: p.gallery,
          cover_image: p.coverImage,
          rating: p.rating,
          review_count: p.reviewCount,
          starting_price: p.startingPrice,
          type: p.type,
          service_categories: p.serviceCategories,
          amenities: p.amenities,
          opening_time: p.openingHours,
          closing_time: p.openingHours,
          verified: p.verified,
          featured: p.featured
        }));
        const { error: pErr } = await client.from('parlors').upsert(parlorsData, { onConflict: 'id' });
        results.parlors = pErr ? pErr.message : `Seeded ${parlorsData.length} parlors`;
      } catch (e: any) {
        results.parlors = e.message;
      }

      // Seed services
      try {
        const servicesData = db.services.map(s => ({
          id: s.id,
          parlor_id: s.parlorId || null,
          name: s.name,
          category: s.category,
          description: s.description,
          duration_minutes: s.durationMinutes,
          price: s.price,
          discount_price: s.originalPrice,
          rating: s.rating,
          review_count: s.reviewCount,
          image: s.image,
          popular: s.popular,
          gender: s.genderSuitability
        }));
        const { error: sErr } = await client.from('services').upsert(servicesData, { onConflict: 'id' });
        results.services = sErr ? sErr.message : `Seeded ${servicesData.length} services`;
      } catch (e: any) {
        results.services = e.message;
      }

      // Seed beauticians
      try {
        const beauticiansData = db.beauticians.map(b => ({
          id: b.id,
          parlor_id: b.parlorId,
          name: b.name,
          role: b.role,
          specialization: b.specialization,
          experience_years: b.experienceYears,
          rating: b.rating,
          review_count: b.reviewCount,
          avatar: b.avatar,
          bio: b.bio,
          available_days: b.availableDays
        }));
        const { error: bErr } = await client.from('beauticians').upsert(beauticiansData, { onConflict: 'id' });
        results.beauticians = bErr ? bErr.message : `Seeded ${beauticiansData.length} beauticians`;
      } catch (e: any) {
        results.beauticians = e.message;
      }

      // Seed packages
      try {
        const packagesData = db.packages.map(pkg => ({
          id: pkg.id,
          parlor_id: pkg.parlorId || null,
          name: pkg.name,
          occasion: pkg.occasion,
          description: pkg.description,
          original_price: pkg.originalPrice,
          package_price: pkg.packagePrice,
          discount_percentage: pkg.discountPercentage || pkg.discountPercent,
          duration_minutes: pkg.durationMinutes || pkg.estimatedDurationMinutes,
          services_included: pkg.servicesIncluded || pkg.includedServices,
          rating: pkg.rating,
          image: pkg.image,
          popular: true
        }));
        const { error: pkgErr } = await client.from('packages').upsert(packagesData, { onConflict: 'id' });
        results.packages = pkgErr ? pkgErr.message : `Seeded ${packagesData.length} packages`;
      } catch (e: any) {
        results.packages = e.message;
      }

      res.json({
        success: true,
        message: 'Sync and seed operation completed',
        results
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Supabase sync failed', details: err.message });
    }
  });


  // Auth Endpoints
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    let user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    
    // Quick role switch / demo login helper
    if (!user) {
      if (email.includes('owner') || role === 'OWNER') {
        user = db.users.find(u => u.role === 'OWNER');
      } else if (email.includes('admin') || role === 'ADMIN') {
        user = db.users.find(u => u.role === 'ADMIN');
      } else {
        user = db.users[0]; // Customer default
      }
    }

    res.json({
      success: true,
      token: `jwt_token_${user.id}_${Date.now()}`,
      user
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, role, phone, city } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: (role as any) || 'CUSTOMER',
      phone: phone || '+91 99887 76655',
      city: city || 'Bengaluru',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    res.status(201).json({
      success: true,
      token: `jwt_token_${newUser.id}_${Date.now()}`,
      user: newUser
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string || 'usr-1';
    const user = db.users.find(u => u.id === userId) || db.users[0];
    res.json({ user });
  });

  // Parlors Endpoints
  app.get('/api/parlors', (req: Request, res: Response) => {
    const { city, category, minRating, maxPrice, search, type, verifiedOnly } = req.query;
    let list = [...db.parlors];

    if (city && city !== 'all') {
      list = list.filter(p => p.city.toLowerCase() === (city as string).toLowerCase());
    }
    if (type && type !== 'all') {
      list = list.filter(p => p.type.toLowerCase() === (type as string).toLowerCase());
    }
    if (category && category !== 'all') {
      list = list.filter(p => p.serviceCategories.includes(category as any));
    }
    if (minRating) {
      list = list.filter(p => p.rating >= parseFloat(minRating as string));
    }
    if (maxPrice) {
      list = list.filter(p => p.startingPrice <= parseFloat(maxPrice as string));
    }
    if (verifiedOnly === 'true') {
      list = list.filter(p => p.verified);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    res.json({ parlors: list, count: list.length });
  });

  app.get('/api/parlors/:id', (req: Request, res: Response) => {
    const parlor = db.parlors.find(p => p.id === req.params.id);
    if (!parlor) {
      return res.status(404).json({ error: 'Parlor not found' });
    }
    const services = db.services.filter(s => !s.parlorId || s.parlorId === parlor.id);
    const beauticians = db.beauticians.filter(b => b.parlorId === parlor.id);
    const reviews = db.reviews.filter(r => r.parlorId === parlor.id);
    const packages = db.packages.filter(pkg => !pkg.parlorId || pkg.parlorId === parlor.id);

    res.json({
      parlor,
      services,
      beauticians,
      reviews,
      packages
    });
  });

  app.post('/api/parlors', (req: Request, res: Response) => {
    const newParlor: Parlor = {
      id: `parlor-${Date.now()}`,
      ...req.body,
      rating: 4.8,
      reviewCount: 1,
      verified: true
    };
    db.parlors.push(newParlor);
    res.status(201).json({ success: true, parlor: newParlor });
  });

  app.put('/api/parlors/:id', (req: Request, res: Response) => {
    const index = db.parlors.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Parlor not found' });
    db.parlors[index] = { ...db.parlors[index], ...req.body };
    res.json({ success: true, parlor: db.parlors[index] });
  });

  // Services Endpoints
  app.get('/api/services', (req: Request, res: Response) => {
    const { category, search, maxPrice, popularOnly } = req.query;
    let list = [...db.services];

    if (category && category !== 'all') {
      list = list.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (maxPrice) {
      list = list.filter(s => s.price <= parseFloat(maxPrice as string));
    }
    if (popularOnly === 'true') {
      list = list.filter(s => s.popular);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    res.json({ services: list, count: list.length });
  });

  app.post('/api/services', (req: Request, res: Response) => {
    const newService: Service = {
      id: `srv-${Date.now()}`,
      rating: 4.9,
      reviewCount: 0,
      image: req.body.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      ...req.body
    };
    db.services.unshift(newService);
    res.status(201).json({ success: true, service: newService });
  });

  app.put('/api/services/:id', (req: Request, res: Response) => {
    const index = db.services.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Service not found' });
    db.services[index] = { ...db.services[index], ...req.body };
    res.json({ success: true, service: db.services[index] });
  });

  app.delete('/api/services/:id', (req: Request, res: Response) => {
    const index = db.services.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Service not found' });
    const deleted = db.services.splice(index, 1)[0];
    res.json({ success: true, service: deleted });
  });

  // Beauticians Endpoints
  app.get('/api/beauticians', (req: Request, res: Response) => {
    const { parlorId, specialization } = req.query;
    let list = [...db.beauticians];

    if (parlorId) {
      list = list.filter(b => b.parlorId === parlorId);
    }
    if (specialization) {
      list = list.filter(b => b.specialization.toLowerCase().includes((specialization as string).toLowerCase()));
    }
    res.json({ beauticians: list, count: list.length });
  });

  app.post('/api/beauticians', (req: Request, res: Response) => {
    const newBeautician: Beautician = {
      id: `beau-${Date.now()}`,
      rating: 4.9,
      reviewCount: 0,
      avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      ...req.body
    };
    db.beauticians.push(newBeautician);
    res.status(201).json({ success: true, beautician: newBeautician });
  });

  app.put('/api/beauticians/:id', (req: Request, res: Response) => {
    const index = db.beauticians.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Beautician not found' });
    db.beauticians[index] = { ...db.beauticians[index], ...req.body };
    res.json({ success: true, beautician: db.beauticians[index] });
  });

  // Packages & Offers
  app.get('/api/packages', (req: Request, res: Response) => {
    const { occasion } = req.query;
    let list = [...db.packages];
    if (occasion && occasion !== 'all') {
      list = list.filter(p => p.occasion.toLowerCase().includes((occasion as string).toLowerCase()));
    }
    res.json({ packages: list });
  });

  app.post('/api/packages', (req: Request, res: Response) => {
    const newPkg = {
      id: `pkg-${Date.now()}`,
      rating: 4.9,
      ...req.body
    };
    db.packages.unshift(newPkg);
    res.status(201).json({ success: true, package: newPkg });
  });

  app.get('/api/offers', (req: Request, res: Response) => {
    res.json({ offers: db.offers });
  });

  app.post('/api/offers', (req: Request, res: Response) => {
    const newOffer = {
      id: `off-${Date.now()}`,
      ...req.body
    };
    db.offers.unshift(newOffer);
    res.status(201).json({ success: true, offer: newOffer });
  });

  // Dynamic Slot Availability (Double Booking Prevention)
  app.get('/api/slots/available', (req: Request, res: Response) => {
    const { beauticianId, date, parlorId } = req.query;
    const allSlots = [
      '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
      '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '06:00 PM', '07:00 PM'
    ];

    // Find taken slots from existing confirmed appointments
    const bookedAppointments = db.appointments.filter(a =>
      a.date === date &&
      (a.beauticianId === beauticianId || (parlorId && a.parlorId === parlorId)) &&
      a.status !== 'cancelled'
    );

    const bookedTimes = bookedAppointments.map(a => a.time);

    const slots = allSlots.map(time => ({
      time,
      available: !bookedTimes.includes(time),
      reason: bookedTimes.includes(time) ? 'Slot already reserved' : 'Available'
    }));

    res.json({ date, beauticianId, slots });
  });

  // Appointments Endpoints
  app.get('/api/appointments', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const { parlorId, status } = req.query;

    let list = [...db.appointments];
    if (userId) {
      list = list.filter(a => a.userId === userId);
    }
    if (parlorId) {
      list = list.filter(a => a.parlorId === parlorId);
    }
    if (status && status !== 'all') {
      list = list.filter(a => a.status === status);
    }

    res.json({ appointments: list, count: list.length });
  });

  app.post('/api/appointments', (req: Request, res: Response) => {
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      parlorId,
      parlorName,
      parlorAddress,
      serviceId,
      serviceName,
      packageId,
      packageName,
      beauticianId,
      beauticianName,
      date,
      time,
      durationMinutes,
      price,
      tax,
      discount,
      totalAmount,
      paymentMethod,
      specialRequests
    } = req.body;

    // Validate required booking parameters
    if (!date || !time || !beauticianId || !parlorId) {
      return res.status(400).json({ error: 'Missing required booking fields (date, time, beautician, parlor)' });
    }

    // Check conflict (prevent double-booking)
    const conflict = db.appointments.find(a =>
      a.date === date &&
      a.time === time &&
      a.beauticianId === beauticianId &&
      a.status !== 'cancelled'
    );

    if (conflict) {
      return res.status(409).json({ error: `Selected slot ${time} on ${date} is already booked for this beautician.` });
    }

    const bookingCode = `GB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingCode,
      userId: userId || 'usr-1',
      userName: userName || 'Ananya Sharma',
      userEmail: userEmail || 'customer@glowbook.com',
      userPhone: userPhone || '+91 98765 43210',
      parlorId,
      parlorName: parlorName || 'Aura Luxury Salon',
      parlorAddress: parlorAddress || 'Bengaluru',
      serviceId,
      serviceName: serviceName || packageName || 'Custom Beauty Service',
      packageId,
      packageName,
      beauticianId,
      beauticianName: beauticianName || 'Certified Specialist',
      date,
      time,
      durationMinutes: durationMinutes || 60,
      price: price || 999,
      tax: tax || 50,
      discount: discount || 0,
      totalAmount: totalAmount || price || 999,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'razorpay',
      paymentId: `pay_test_${Math.floor(100000 + Math.random() * 900000)}`,
      specialRequests,
      createdAt: new Date().toISOString(),
      reviewed: false
    };

    db.appointments.unshift(newAppointment);

    // Asynchronously sync to Supabase if available
    const supabase = getSupabaseClient();
    if (supabase) {
      void (async () => {
        try {
          const { error } = await supabase.from('appointments').insert([{
            id: newAppointment.id,
            booking_code: newAppointment.bookingCode,
            user_id: newAppointment.userId,
            user_name: newAppointment.userName,
            user_email: newAppointment.userEmail,
            user_phone: newAppointment.userPhone,
            parlor_id: newAppointment.parlorId,
            parlor_name: newAppointment.parlorName,
            parlor_address: newAppointment.parlorAddress,
            service_id: newAppointment.serviceId,
            service_name: newAppointment.serviceName,
            package_id: newAppointment.packageId,
            package_name: newAppointment.packageName,
            beautician_id: newAppointment.beauticianId,
            beautician_name: newAppointment.beauticianName,
            date: newAppointment.date,
            time: newAppointment.time,
            duration_minutes: newAppointment.durationMinutes,
            price: newAppointment.price,
            tax: newAppointment.tax,
            discount: newAppointment.discount,
            total_amount: newAppointment.totalAmount,
            status: newAppointment.status,
            payment_status: newAppointment.paymentStatus,
            payment_method: newAppointment.paymentMethod,
            payment_id: newAppointment.paymentId,
            special_requests: newAppointment.specialRequests,
            reviewed: newAppointment.reviewed
          }]);
          if (error) {
            console.warn('Supabase appointment insert note:', error.message);
          } else {
            console.log('✅ Synced new appointment to Supabase:', newAppointment.id);
          }
        } catch (err: any) {
          console.warn('Supabase async sync error:', err.message);
        }
      })();
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: newAppointment
    });
  });

  app.patch('/api/appointments/:id/status', (req: Request, res: Response) => {
    const { status, date, time } = req.body;
    const appt = db.appointments.find(a => a.id === req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    if (status) appt.status = status;
    if (date) appt.date = date;
    if (time) appt.time = time;

    res.json({ success: true, appointment: appt });
  });

  // Payment Test Simulator (Sandbox Stripe / Razorpay)
  app.post('/api/payments/checkout', (req: Request, res: Response) => {
    const { amount, currency, gateway } = req.body;
    const orderId = `order_${gateway || 'rzp'}_${Date.now()}`;
    res.json({
      success: true,
      orderId,
      amount: amount || 999,
      currency: currency || 'INR',
      key: 'rzp_test_glowbook_ai_sandbox_key',
      gateway: gateway || 'razorpay'
    });
  });

  app.post('/api/payments/verify', (req: Request, res: Response) => {
    const { paymentId, orderId } = req.body;
    res.json({
      success: true,
      verified: true,
      paymentId: paymentId || `pay_verified_${Date.now()}`,
      orderId: orderId || `order_${Date.now()}`,
      message: 'Test payment verified successfully!'
    });
  });

  // Reviews Endpoints
  app.get('/api/reviews', (req: Request, res: Response) => {
    const { parlorId } = req.query;
    let list = [...db.reviews];
    if (parlorId) {
      list = list.filter(r => r.parlorId === parlorId);
    }
    res.json({ reviews: list, count: list.length });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { userId, userName, parlorId, serviceName, beauticianName, rating, comment, appointmentId } = req.body;
    if (!parlorId || !rating || !comment) {
      return res.status(400).json({ error: 'Rating, comment, and parlor are required' });
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: userId || 'usr-1',
      userName: userName || 'Ananya Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      parlorId,
      serviceName,
      beauticianName,
      rating: parseFloat(rating),
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedBooking: true
    };

    db.reviews.unshift(newReview);

    // Update appointment review state
    if (appointmentId) {
      const appt = db.appointments.find(a => a.id === appointmentId);
      if (appt) appt.reviewed = true;
    }

    // Recalculate parlor rating
    const parlor = db.parlors.find(p => p.id === parlorId);
    if (parlor) {
      const parlorReviews = db.reviews.filter(r => r.parlorId === parlorId);
      const avg = parlorReviews.reduce((sum, r) => sum + r.rating, 0) / parlorReviews.length;
      parlor.rating = parseFloat(avg.toFixed(1));
      parlor.reviewCount = parlorReviews.length;
    }

    res.status(201).json({ success: true, review: newReview });
  });

  // Wishlist Endpoints
  app.get('/api/wishlist', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string || 'usr-1';
    const userWishlist = db.wishlist.filter(w => w.userId === userId);
    res.json({ wishlist: userWishlist });
  });

  app.post('/api/wishlist/toggle', (req: Request, res: Response) => {
    const { userId = 'usr-1', itemId, itemType } = req.body;
    const index = db.wishlist.findIndex(w => w.userId === userId && w.itemId === itemId);
    let isSaved = false;

    if (index > -1) {
      db.wishlist.splice(index, 1);
      isSaved = false;
    } else {
      db.wishlist.push({ userId, itemId, itemType });
      isSaved = true;
    }

    res.json({ success: true, isSaved, wishlist: db.wishlist.filter(w => w.userId === userId) });
  });

  // AI Endpoints
  app.post('/api/ai/consultant', async (req: Request, res: Response) => {
    try {
      const recommendation = await generateBeautyConsultation(req.body);
      db.aiRecommendations.push(recommendation);
      res.json({ success: true, recommendation });
    } catch (err: any) {
      res.status(500).json({ error: 'AI consultation failed', details: err.message });
    }
  });

  app.post('/api/ai/package-builder', async (req: Request, res: Response) => {
    try {
      const recommendation = await generateBeautyConsultation({
        ...req.body,
        userInput: `Custom Package Request: ${req.body.occasion} with budget ₹${req.body.budget}. Preferred Services: ${(req.body.desiredServices || []).join(', ')}`
      });
      res.json({ success: true, package: recommendation });
    } catch (err: any) {
      res.status(500).json({ error: 'AI package builder failed', details: err.message });
    }
  });

  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const { messages } = req.body;
      const response = await generateGlowBotReply(messages || []);
      res.json({ success: true, ...response });
    } catch (err: any) {
      res.status(500).json({ error: 'GlowBot AI chat failed', details: err.message });
    }
  });

  app.post('/api/ai/style-recommendation', async (req: Request, res: Response) => {
    try {
      const result = await generateStyleRecommendations(req.body);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ error: 'AI style recommendation failed', details: err.message });
    }
  });

  // Admin & Owner Analytics Endpoints
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const totalUsers = db.users.length;
    const totalParlors = db.parlors.length;
    const totalBookings = db.appointments.length;
    const totalRevenue = db.appointments.reduce((sum, a) => sum + (a.status !== 'cancelled' ? a.totalAmount : 0), 0);
    const activeServices = db.services.length;

    const monthlyRevenue = [
      { month: 'Apr', revenue: 42000, bookings: 38 },
      { month: 'May', revenue: 68000, bookings: 54 },
      { month: 'Jun', revenue: 95000, bookings: 76 },
      { month: 'Jul', revenue: 134000, bookings: 102 },
      { month: 'Aug', revenue: 182000, bookings: 140 }
    ];

    const categoryDistribution = [
      { name: 'Makeup & Bridal', percentage: 38, count: 85 },
      { name: 'Facials & Skin', percentage: 28, count: 62 },
      { name: 'Hair Treatments', percentage: 20, count: 44 },
      { name: 'Nails & Spa', percentage: 14, count: 31 }
    ];

    res.json({
      totalUsers,
      totalParlors,
      totalBookings,
      totalRevenue,
      activeServices,
      monthlyRevenue,
      categoryDistribution,
      topParlors: db.parlors.slice(0, 4)
    });
  });

  app.get('/api/owner/stats', (req: Request, res: Response) => {
    const parlorId = (req.query.parlorId as string) || 'parlor-1';
    const parlor = db.parlors.find(p => p.id === parlorId) || db.parlors[0];
    const appointments = db.appointments.filter(a => a.parlorId === parlorId);
    const revenue = appointments.reduce((sum, a) => sum + (a.status !== 'cancelled' ? a.totalAmount : 0), 0);
    const beauticians = db.beauticians.filter(b => b.parlorId === parlorId);
    const services = db.services.filter(s => !s.parlorId || s.parlorId === parlorId);

    res.json({
      parlor,
      totalBookings: appointments.length,
      todayAppointments: appointments.filter(a => a.date === '2026-09-02').length || 1,
      totalRevenue: revenue,
      beauticiansCount: beauticians.length,
      servicesCount: services.length,
      rating: parlor.rating,
      reviewCount: parlor.reviewCount,
      recentAppointments: appointments.slice(0, 5)
    });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ GlowBook AI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
