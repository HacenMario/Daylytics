const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Get today's analysis
router.get('/today', auth, async (req, res) => {
    try {
        // Simulate AI analysis with realistic data
        const analysis = {
            productivity: Math.floor(Math.random() * 30) + 65, // 65-95%
            restScore: Math.floor(Math.random() * 25) + 55, // 55-80%
            sleepQuality: Math.floor(Math.random() * 25) + 60, // 60-85%
            stressLevel: Math.floor(Math.random() * 30) + 15, // 15-45%
            totalMinutes: Math.floor(Math.random() * 200) + 200, // 200-400 min
            activitiesCount: Math.floor(Math.random() * 4) + 3, // 3-7 activities
            insights: [
                {
                    title: '🚀 أداء جيد',
                    description: 'أنت تؤدي بشكل جيد اليوم. استمر في الحفاظ على هذا المستوى.',
                    recommendation: 'حاول تحسين جودة النوم للحصول على نتائج أفضل.',
                    priority: 1
                },
                {
                    title: '💡 نصيحة ذكية',
                    description: 'توزيع وقتك متوازن بين العمل والراحة.',
                    recommendation: 'خصص 15 دقيقة للاسترخاء كل ساعتين.',
                    priority: 2
                }
            ]
        };
        res.json({ analysis, recommendations: [] });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to analyze' });
    }
});

// Compare periods
router.get('/compare', auth, async (req, res) => {
    try {
        const { period1 = 'today', period2 = 'yesterday' } = req.query;
        
        const p1 = {
            label: period1,
            productivity: Math.floor(Math.random() * 25) + 65,
            rest: Math.floor(Math.random() * 20) + 60,
            sleep: Math.floor(Math.random() * 20) + 65,
            activities: Math.floor(Math.random() * 4) + 3
        };
        
        const p2 = {
            label: period2,
            productivity: Math.floor(Math.random() * 25) + 60,
            rest: Math.floor(Math.random() * 20) + 55,
            sleep: Math.floor(Math.random() * 20) + 60,
            activities: Math.floor(Math.random() * 4) + 2
        };
        
        const productivityChange = ((p1.productivity - p2.productivity) / (p2.productivity || 1)) * 100;
        
        res.json({
            period1: p1,
            period2: p2,
            changes: {
                productivity: productivityChange,
                rest: ((p1.rest - p2.rest) / (p2.rest || 1)) * 100,
                sleep: ((p1.sleep - p2.sleep) / (p2.sleep || 1)) * 100,
                activities: ((p1.activities - p2.activities) / (p2.activities || 1)) * 100
            },
            trend: {
                productivity: p1.productivity > p2.productivity ? 'up' : 'down',
                rest: p1.rest > p2.rest ? 'up' : 'down',
                sleep: p1.sleep > p2.sleep ? 'up' : 'down'
            },
            insights: [
                {
                    title: productivityChange > 0 ? '📈 تحسن ملحوظ' : '📉 انخفاض طفيف',
                    description: productivityChange > 0 
                        ? 'الإنتاجية أفضل من الفترة السابقة.'
                        : 'حاول تحسين إنتاجيتك في الفترة القادمة.'
                }
            ]
        });
    } catch (error) {
        console.error('Compare error:', error);
        res.status(500).json({ error: 'Failed to compare' });
    }
});

// Get recommendations
router.get('/recommendations', auth, async (req, res) => {
    try {
        const recommendations = [
            {
                category: 'productivity',
                title: '🎯 زيادة الإنتاجية',
                description: 'استخدم تقنية بومودورو لتحسين تركيزك.',
                action: '25 دقيقة عمل، 5 دقائق راحة',
                priority: 'high'
            },
            {
                category: 'rest',
                title: '😴 تحسين النوم',
                description: 'حاول النوم في نفس الوقت كل يوم.',
                action: 'حدد موعد نوم منتظم',
                priority: 'medium'
            },
            {
                category: 'stress',
                title: '🧘 تقليل التوتر',
                description: 'ممارسة التأمل لمدة 5 دقائق يومياً.',
                action: 'جرب تطبيق التأمل',
                priority: 'medium'
            }
        ];
        res.json({ recommendations });
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

module.exports = router;