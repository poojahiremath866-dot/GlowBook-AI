import { GoogleGenAI, Type } from '@google/genai';
import { db } from './db';
import { AIRecommendation, StyleAnalysisResult } from '../src/types';

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. AI Beauty Consultant
export async function generateBeautyConsultation(params: {
  userInput?: string;
  occasion?: string;
  budget?: number;
  preferredStyle?: string;
  availableTime?: string;
  targetDate?: string;
  city?: string;
}): Promise<AIRecommendation> {
  const ai = getAiClient();
  const availableParlorsSummary = db.parlors.map(p => `${p.name} in ${p.city} (Rating: ${p.rating})`).join(', ');
  const availableServicesSummary = db.services.map(s => `${s.name} (${s.category}, ₹${s.price}, ${s.durationMinutes}m)`).join(', ');

  const systemInstruction = `You are "GlowConsultant", the elite AI Beauty & Salon Consultant at GlowBook AI.
Your purpose is to provide tailored, professional beauty and styling recommendations matching the client's occasion, budget (in INR ₹), desired aesthetic, and available time.
Available Parlors on platform: ${availableParlorsSummary}.
Available Services: ${availableServicesSummary}.
You must always recommend services that fit realistically within their budget and time.
Never give medical or dermatological diagnoses. Emphasize that all suggestions are general styling advice.`;

  const prompt = `Client Consultation Request:
- Custom Notes / Description: ${params.userInput || 'Custom consultation'}
- Occasion: ${params.occasion || 'Special Celebration'}
- Budget: ₹${params.budget || 5000}
- Preferred Style: ${params.preferredStyle || 'Elegant Natural Glow'}
- Available Time: ${params.availableTime || '2 to 3 hours'}
- Target City: ${params.city || 'Bengaluru'}
- Target Date: ${params.targetDate || 'Upcoming Weekend'}

Generate a structured beauty plan.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              packageName: { type: Type.STRING },
              overview: { type: Type.STRING },
              recommendedServices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    estimatedCost: { type: Type.NUMBER },
                    duration: { type: Type.STRING }
                  },
                  required: ['name', 'description', 'estimatedCost', 'duration']
                }
              },
              totalEstimatedCost: { type: Type.NUMBER },
              totalEstimatedDuration: { type: Type.STRING },
              suggestedParlorName: { type: Type.STRING },
              suggestedBeauticianName: { type: Type.STRING },
              suggestedBeauticianSpecialization: { type: Type.STRING },
              proStylingTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              prepChecklist: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: [
              'packageName',
              'overview',
              'recommendedServices',
              'totalEstimatedCost',
              'totalEstimatedDuration',
              'suggestedParlorName',
              'suggestedBeauticianName',
              'suggestedBeauticianSpecialization',
              'proStylingTips',
              'prepChecklist'
            ]
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      const matchedParlor = db.parlors.find(p => p.name.toLowerCase().includes((parsed.suggestedParlorName || '').toLowerCase())) || db.parlors[0];
      const matchedBeautician = db.beauticians.find(b => b.name.toLowerCase().includes((parsed.suggestedBeauticianName || '').toLowerCase())) || db.beauticians[0];

      return {
        id: `rec-${Date.now()}`,
        occasion: params.occasion || 'Event',
        budget: params.budget || 5000,
        preferredStyle: params.preferredStyle || 'Natural Glam',
        availableTime: params.availableTime || '2 Hours',
        targetDate: params.targetDate,
        packageName: parsed.packageName || 'Personalized Glow Package',
        overview: parsed.overview || 'A custom-curated beauty sequence designed to give you radiant glow and lasting elegance.',
        recommendedServices: parsed.recommendedServices || [
          { name: 'Hydra Radiant Glow Facial', description: 'Deep cleansing and hydration infusion', estimatedCost: 2499, duration: '60 mins' },
          { name: 'Precision Designer Haircut & Blowdry', description: 'Voluminous styled locks', estimatedCost: 899, duration: '45 mins' }
        ],
        totalEstimatedCost: parsed.totalEstimatedCost || (params.budget || 4500),
        totalEstimatedDuration: parsed.totalEstimatedDuration || '2 hours 15 mins',
        suggestedParlor: {
          id: matchedParlor.id,
          name: matchedParlor.name,
          city: matchedParlor.city,
          rating: matchedParlor.rating,
        },
        suggestedBeautician: {
          id: matchedBeautician.id,
          name: matchedBeautician.name,
          specialization: matchedBeautician.specialization,
        },
        proStylingTips: parsed.proStylingTips || [
          'Hydrate well 24 hours prior to your appointment.',
          'Bring reference photos of your outfit to coordinate makeup undertones.',
          'Avoid harsh active exfoliants 48 hours before facial treatments.'
        ],
        prepChecklist: parsed.prepChecklist || [
          'Arrive with clean, makeup-free skin',
          'Wear comfortable button-down attire for easy wardrobe transition',
          'Inform your stylist of any contact lens or skin allergies'
        ],
        disclaimer: 'AI recommendations are general styling & beauty consultations only and do not constitute clinical or dermatological medical diagnoses.'
      };
    } catch (err) {
      console.warn('Gemini API call failed, using graceful fallback intelligence:', err);
    }
  }

  // Graceful intelligent fallback
  const budget = params.budget || 5000;
  const occasion = params.occasion || 'Celebration';
  const parlor = db.parlors[0];
  const beautician = db.beauticians[0];

  return {
    id: `rec-${Date.now()}`,
    occasion,
    budget,
    preferredStyle: params.preferredStyle || 'Classic Elegance',
    availableTime: params.availableTime || '2.5 Hours',
    targetDate: params.targetDate || '2026-09-10',
    packageName: `${occasion} Signature Glow Package`,
    overview: `Specially crafted for your ${occasion.toLowerCase()} aesthetic with a budget of ₹${budget.toLocaleString()}. Carefully balances radiant skin prep, hair texture styling, and flawless finish.`,
    recommendedServices: [
      { name: 'Hydra Radiant Glow Facial', description: 'Restores moisture barrier and provides luminous camera-ready radiance.', estimatedCost: 2499, duration: '60 mins' },
      { name: 'High-Definition (HD) Party & Cocktail Glam', description: 'Long-wearing waterproof base with customizable eye glam.', estimatedCost: 1999, duration: '60 mins' },
      { name: 'Eyebrow Architecture & Upper Lip Threading', description: 'Sharp definition and clean arches to frame the eyes.', estimatedCost: 149, duration: '15 mins' }
    ],
    totalEstimatedCost: Math.min(budget, 4647),
    totalEstimatedDuration: '2 hours 15 minutes',
    suggestedParlor: {
      id: parlor.id,
      name: parlor.name,
      city: parlor.city,
      rating: parlor.rating
    },
    suggestedBeautician: {
      id: beautician.id,
      name: beautician.name,
      specialization: beautician.specialization
    },
    proStylingTips: [
      'Coordinate warm gold or rose champagne highlights with rich silk or festive fabrics.',
      'Drink plenty of water and apply lip balm regularly before the event.',
      'Keep blotting sheets handy for oil-free camera photos throughout your event.'
    ],
    prepChecklist: [
      'Wash hair with clarifying shampoo 1 night prior if booking blowouts',
      'Arrive 10 minutes early to discuss personal skin preferences',
      'Share your jewelry palette (silver vs gold vs antique) with the makeup artist'
    ],
    disclaimer: 'AI recommendations are general styling & beauty consultations only and do not constitute clinical or dermatological medical diagnoses.'
  };
}

// 2. GlowBot Conversational Chatbot
export async function generateGlowBotReply(messages: { sender: 'user' | 'bot'; text: string }[]): Promise<{
  reply: string;
  quickActions: { label: string; action: string; payload?: any }[];
  suggestedPackage?: any;
}> {
  const ai = getAiClient();
  const lastUserMessage = messages[messages.length - 1]?.text || 'Hello';

  const systemInstruction = `You are "GlowBot", the warm, glamorous, and highly knowledgeable AI Beauty Concierge at GlowBook AI.
You assist clients with beauty services (Hair, Skin, Makeup, Nails, Spa, Threading), appointment prep tips, pricing guidance, salon recommendations in Bengaluru, Mysuru, Hubballi, Dharwad, Belagavi, Hyderabad, Chennai, and styling advice.
Tone: Welcoming, sophisticated, encouraging, clear, and helpful.
Never provide medical or clinical dermatology advice.
Always encourage booking through GlowBook AI platform.`;

  if (ai) {
    try {
      const chatHistory = messages.slice(0, -1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: 'gemini-3.7-flash',
        config: {
          systemInstruction,
        },
        history: chatHistory
      });

      const response = await chat.sendMessage({ message: lastUserMessage });
      const text = response.text || "I'd be delighted to help you discover the perfect beauty service or parlor on GlowBook AI!";

      // Contextual quick actions
      const lower = lastUserMessage.toLowerCase();
      let quickActions: { label: string; action: string; payload?: any }[] = [
        { label: '✨ AI Beauty Consultant', action: 'open_consultant' },
        { label: '💇‍♀️ Explore Services', action: 'explore_services' },
        { label: '💄 Top Parlors', action: 'explore_parlors' },
      ];

      if (lower.includes('wedding') || lower.includes('bridal') || lower.includes('bride')) {
        quickActions = [
          { label: '👑 View Bridal Packages', action: 'view_bridal_packages' },
          { label: '📅 Book Bridal Consultation', action: 'book_bridal' },
          { label: '💄 Bridal Artists', action: 'explore_beauticians' }
        ];
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('discount')) {
        quickActions = [
          { label: '🏷️ View Special Offers', action: 'view_offers' },
          { label: '💎 Package Builder', action: 'open_package_builder' },
          { label: '🔍 Services Under ₹1000', action: 'filter_budget' }
        ];
      }

      return {
        reply: text,
        quickActions
      };
    } catch (err) {
      console.warn('Gemini chat error, fallback active:', err);
    }
  }

  // Graceful rule-based response
  const text = lastUserMessage.toLowerCase();
  let reply = "Hello gorgeous! I'm GlowBot, your AI beauty concierge. I can help you pick the best facial, choose between bridal airbrush and HD makeup, find top salons in your city, or design a custom package for any occasion. What are you looking for today?";
  let quickActions: { label: string; action: string; payload?: any }[] = [
    { label: '✨ AI Beauty Consultant', action: 'open_consultant' },
    { label: '💇‍♀️ Browse Services', action: 'explore_services' },
    { label: '🏷️ Special Offers', action: 'view_offers' }
  ];

  if (text.includes('wedding') || text.includes('bridal')) {
    reply = "For weddings, we recommend starting your beauty timeline 3-4 weeks prior! A prep facial like the Hydra Radiant Glow or Gold Radiance Facial, followed by trial hair styling and our Signature Royal Airbrush Bridal Makeover will ensure you look unforgettable.";
    quickActions = [
      { label: '👑 Royal Bridal Package', action: 'view_bridal_packages' },
      { label: '✨ Build Bridal Package', action: 'open_package_builder' },
      { label: '💄 Book Master Artist', action: 'explore_beauticians' }
    ];
  } else if (text.includes('facial') || text.includes('skin') || text.includes('glow')) {
    reply = "Our top-rated skin treatments include the Hydra Radiant Glow Facial (₹2,499) for immediate hydration, the 24K Gold Radiance Facial (₹2,999) for bridal luminosity, and the Purifying Organic Cleanup (₹899) for clear pores. All use sanitized medical-grade tools and soothing botanical serums.";
    quickActions = [
      { label: '✨ Book Hydra Facial', action: 'book_service', payload: 'srv-5' },
      { label: '💆‍♀️ View Skin Services', action: 'filter_category', payload: 'skin' }
    ];
  } else if (text.includes('hair') || text.includes('color') || text.includes('keratin') || text.includes('cut')) {
    reply = "From precision face-framing cuts (₹899) to deep nourishing Keratin peptide hair spas (₹1,899) and balayage highlights (₹4,499), our salons use ammonia-free L'Oréal and Moroccan Argan oils for lustrous health!";
    quickActions = [
      { label: '💇‍♀️ Book Hair Spa', action: 'book_service', payload: 'srv-2' },
      { label: '✨ Haircut & Blowdry', action: 'book_service', payload: 'srv-1' }
    ];
  }

  return { reply, quickActions };
}

// 3. AI Style Recommendation & Multimodal Image Analysis
export async function generateStyleRecommendations(params: {
  textPrompt?: string;
  imageBase64?: string;
  imageMimeType?: string;
  occasion?: string;
  preferredTone?: string;
}): Promise<StyleAnalysisResult> {
  const ai = getAiClient();

  const systemInstruction = `You are "GlowStylist AI", an international beauty, color theory, and styling expert at GlowBook AI.
You evaluate styling aesthetics (hairstyles, makeup palettes, color harmony, and occasion appropriateness).
CRITICAL RULES:
- Never make clinical, medical, dermatological, or bodily diagnostic claims.
- Never criticize or point out physical flaws.
- Provide uplifting, empowering, and stylish beauty recommendations.
- Suggest matching salon services from Hair, Skin, Nails, and Makeup categories.`;

  const promptText = `Occasion: ${params.occasion || 'Evening Celebration'}
Preferences: ${params.preferredTone || 'Warm Elegance & High-Glamour'}
User Notes: ${params.textPrompt || 'Provide comprehensive hairstyle, makeup, and color palette ideas.'}

Analyze the styling request and return a structured JSON response.`;

  if (ai) {
    try {
      let contents: any = promptText;

      if (params.imageBase64 && params.imageMimeType) {
        contents = {
          parts: [
            {
              inlineData: {
                data: params.imageBase64.replace(/^data:image\/\w+;base64,/, ''),
                mimeType: params.imageMimeType || 'image/jpeg'
              }
            },
            { text: `${promptText}\nAnalyze the submitted photo for complementary hairstyle, color palette coordination, and makeup tones.` }
          ]
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hairRecommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    style: { type: Type.STRING },
                    description: { type: Type.STRING },
                    maintenance: { type: Type.STRING }
                  },
                  required: ['style', 'description', 'maintenance']
                }
              },
              makeupRecommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    look: { type: Type.STRING },
                    palette: { type: Type.ARRAY, items: { type: Type.STRING } },
                    description: { type: Type.STRING }
                  },
                  required: ['look', 'palette', 'description']
                }
              },
              colorCoordination: {
                type: Type.OBJECT,
                properties: {
                  paletteName: { type: Type.STRING },
                  hexCodes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  advice: { type: Type.STRING }
                },
                required: ['paletteName', 'hexCodes', 'advice']
              },
              occasionGuidance: { type: Type.STRING },
              suggestedServices: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: [
              'hairRecommendations',
              'makeupRecommendations',
              'colorCoordination',
              'occasionGuidance',
              'suggestedServices'
            ]
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        ...parsed,
        disclaimer: 'AI style recommendations are general visual design suggestions and do not constitute clinical or dermatological medical advice.'
      };
    } catch (err) {
      console.warn('Gemini style recommendation error:', err);
    }
  }

  // Graceful fallback
  return {
    hairRecommendations: [
      {
        style: 'Soft Hollywood Mermaid Waves',
        description: 'Voluminous polished waves with a deep side parting and high-gloss argan finish.',
        maintenance: 'Low maintenance, holds with flexible setting spray for up to 12 hours.'
      },
      {
        style: 'Textured Romantic Low Chignon with Floral Pins',
        description: 'Delicate tendrils framing the jawline with a secure braided bun at the nape.',
        maintenance: 'Zero touch-up required during dance and celebratory festivities.'
      }
    ],
    makeupRecommendations: [
      {
        look: 'Rose-Gold Dewy Radiance',
        palette: ['#E0A899', '#D4AF37', '#78350F', '#FDE68A'],
        description: 'Luminous satin base with champagne shimmer eyelids, soft terracotta blush, and glossy nude lips.'
      },
      {
        look: 'Classic Regal Berry & Bronze HD Glam',
        palette: ['#831843', '#92400E', '#FBBF24', '#451A03'],
        description: 'Defined winged liner with warm metallic bronze eye shadows and a bold deep berry matte lipstick.'
      }
    ],
    colorCoordination: {
      paletteName: 'Royal Warm Sunset & Rose Glow',
      hexCodes: ['#881337', '#BE123C', '#F43F5E', '#FBBF24', '#FEF3C7'],
      advice: 'Pair with rich jewel tones such as emerald green, royal navy, wine burgundy, or deep ivory silks to highlight your natural undertones.'
    },
    occasionGuidance: 'Ideal for celebratory gatherings, evening receptions, or gala occasions where balanced camera illumination and long-lasting freshness are essential.',
    suggestedServices: [
      'High-Definition (HD) Party & Cocktail Glam',
      'Precision Designer Haircut & Blowdry',
      'Russian Gel Nail Art & Extensions',
      'Hydra Radiant Glow Facial'
    ],
    disclaimer: 'AI style recommendations are general visual design suggestions and do not constitute clinical or dermatological medical advice.'
  };
}
