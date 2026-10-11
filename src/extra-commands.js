import crypto from 'node:crypto';
import {numberOf,normalize} from './util.js';
import {DAY} from './store.js';
import {user} from './economy.js';

export const extraCategories={"Group":["members","requests","accept","reject","groupavatar","setgroupavatar","rules","setrules","nick","delnick","nicks","mynick","checkin","attendance","resetattendance","warnlimit","clearwarns","allwarnings","schedule","schedules","cancelschedule"],"Economy":["weekly","monthly"],"Tools":["wordcount","base64","unbase64","hash","password","time","choose","vp","vpp"],"Fun":["compliment","quote"]};
export const extraArabic={"members":"الأعضاء","requests":"الطلبات","accept":"قبول","reject":"رفض","groupavatar":"صورة_المجموعة","setgroupavatar":"جروب_صورة","rules":"قوانين","setrules":"قوانين_تعيين","nick":"لقب","delnick":"حذف_لقب","nicks":"الألقاب","mynick":"لقبي","checkin":"حاضر","attendance":"قائمة_الحضور","resetattendance":"مسح_الحضور","warnlimit":"حد_الإنذارات","clearwarns":"مسح_الإنذارات","allwarnings":"كل_الإنذارات","schedule":"جدولة_الجروب","schedules":"جدولة","cancelschedule":"إلغاء_جدولة","weekly":"أسبوعي","monthly":"شهري","wordcount":"حساب_الحروف","base64":"تشفير","unbase64":"فك_تشفير","hash":"بصمة","password":"كلمة_مرور","time":"وقت","choose":"اختيار","vp":"كشف","vpp":"كشف_خاص","compliment":"مدح","quote":"حكمة"};
export const extraUsage={"members":"members","requests":"requests (group admins)","accept":"accept <request phone> (admins)","reject":"reject <request phone> (admins)","groupavatar":"groupavatar","setgroupavatar":"setgroupavatar (reply to ordinary image; admins)","rules":"rules","setrules":"setrules <group rules> (admins)","nick":"nick <your nickname> or nick @member <nickname> (admins)","delnick":"delnick [@member] (own nickname or admins)","nicks":"nicks","mynick":"mynick","checkin":"checkin (daily attendance)","attendance":"attendance","resetattendance":"resetattendance (admins)","warnlimit":"warnlimit 1–10 (admins)","clearwarns":"clearwarns @member (admins)","allwarnings":"allwarnings (admins)","schedule":"schedule open|close 30m (admins; 1m–7d)","schedules":"schedules (admins)","cancelschedule":"cancelschedule <id> (admins)","weekly":"weekly (registered players; 7-day cooldown)","monthly":"monthly (registered players; 30-day cooldown)","wordcount":"wordcount <text> or reply","base64":"base64 <text> or reply (encoding, not secure encryption)","unbase64":"unbase64 <base64>","hash":"hash <text> or reply (SHA-256)","password":"password [length 8–64] (private chat only)","time":"time (Morocco)","choose":"choose option A | option B [| option C]","vp":"vp (reply to view-once media)","vpp":"vpp (reply to view-once media to send in private)","compliment":"compliment","quote":"quote"};

const pick=list=>list[crypto.randomInt(list.length)];

const complimentsList = [
 {ar:'الجهد ديالك عندو قيمة، حتى إلا ما بانش اليوم.',en:'Your effort counts, even when progress is hard to see.'},
 {ar:'وجودك كيقدر يبدّل نهار شي واحد للأحسن.',en:'Your presence can make someone’s day better.'},
 {ar:'كل مرة كتتعلم فيها، راك كتزيد خطوة.',en:'Every time you learn, you take a step forward.'},
 {ar:'عندك طاقة إيجابية كتوصل للجميع.',en:'You have an infectious positive energy.'},
 {ar:'طريقتك ف التفكير مميزة وذكية.',en:'Your way of thinking is unique and smart.'},
 {ar:'أسلوبك ف الكلام دايماً راقي ومحترم.',en:'Your way of speaking is always polite and respectful.'},
 {ar:'ابتسامتك كتعطي أمل وراحة للناس.',en:'Your smile brings hope and comfort to people.'},
 {ar:'حكمتك كتساعد الناس ف أوقات الشدة.',en:'Your wisdom helps people in tough times.'},
 {ar:'عندك قدرة كبيرة على التحمل والصبر.',en:'You have incredible patience and resilience.'},
 {ar:'شخصيتك القوية كتخلي كلشي يحترمك.',en:'Your strong personality earns everyone’s respect.'},
 {ar:'الطيبة ديال قلبك هي سر الجمال ديالك.',en:'The kindness of your heart is your true beauty.'},
 {ar:'تبارك الله عليك دايماً منظم ومرتب.',en:'You are always organized and well-prepared.'},
 {ar:'عندك ذوق راقي ف كل حاجة كتختارها.',en:'You have great taste in everything you choose.'},
 {ar:'حضورك ف أي بلاصة كيعطيها قيمة كتر.',en:'Your presence adds value wherever you go.'},
 {ar:'إخلاصك كيبان ف النتائج ديالك.',en:'Your dedication shows in your results.'},
 {ar:'شخصيتك نادرة وماكتكررش.',en:'Your personality is rare and irreplaceable.'},
 {ar:'دائماً كتعطي إلهام للناس لي دايرين بيك.',en:'You constantly inspire those around you.'},
 {ar:'شجاعتك ف مواجهة الصعاب كتميزك.',en:'Your courage in facing difficulties sets you apart.'},
 {ar:'تفكيرك الإيجابي كيرجع كل مشكلة حل.',en:'Your positive thinking turns problems into solutions.'},
 {ar:'صدقك هو سر نجاحك ف العلاقات.',en:'Your honesty is the key to your great relationships.'},
 {ar:'عندك عين زوينة كتشوف غير الحاجات الإيجابية.',en:'You have a wonderful eye for seeing the good.'},
 {ar:'روح الدعابة عندك كتفرح القلب.',en:'Your sense of humor brings genuine joy.'},
 {ar:'كتحسن من نفسك كل نهار وداكشي كيبان.',en:'You improve every day and it really shows.'},
 {ar:'قدرتك على الاستماع وفهم الآخرين حاجة نادرة.',en:'Your ability to listen and understand is rare.'},
 {ar:'صداقتك كنز حقيقي لأي واحد عرفك.',en:'Your friendship is a true treasure.'},
 {ar:'الهدوء ديالك وقت الأزمات قوة كبيرة.',en:'Your calmness during crisis is a great strength.'},
 {ar:'عندك إرادة من حديد كتوصلك لأهدافك.',en:'You have an iron willpower that reaches your goals.'},
 {ar:'كتعطي من قلبك بلا ما تنتظر مقابل.',en:'You give from your heart without expecting back.'},
 {ar:'طموحك الكبير غادي يوصلك لبلايص بعيدة.',en:'Your big ambition will take you far.'},
 {ar:'عقليتك المتفتحة كتخلي التعامل معاك مريح.',en:'Your open mind makes communicating with you easy.'},
 {ar:'تأثيرك الإيجابي كيبقى حتى ف غيابك.',en:'Your positive impact lasts even in your absence.'},
 {ar:'عندك لمسة خاصة ف كل حاجة كتديرها.',en:'You have a special touch in everything you do.'},
 {ar:'كتعرف كيفاش تفرح الناس بكلمة بسيطة.',en:'You know how to cheer people up with simple words.'},
 {ar:'إيمانك بقدراتك هو لي كيجعل منك شخص ناجح.',en:'Believing in yourself makes you successful.'},
 {ar:'عندك حس مسؤولية عالي كيتوثق فيه.',en:'You have a high sense of reliability.'},
 {ar:'كتعرف تختار كلماتك بعناية ولباقة.',en:'You choose your words with care and tact.'},
 {ar:'شغفك بالحياة كيبان ف عينيك.',en:'Your passion for life shines in your eyes.'},
 {ar:'دايماً كتعطي فرصة ثانية وكتسامح.',en:'You are always forgiving and open-hearted.'},
 {ar:'ذكاؤك الاجتماعي كيسهل عليك التواصل.',en:'Your social intelligence builds easy connections.'},
 {ar:'قدرتك على التكيف مع التغيير ممتازة.',en:'Your adaptability to change is admirable.'},
 {ar:'ثقتك ف نفسك كتخليك دائماً متألق.',en:'Your self-confidence makes you shine.'},
 {ar:'تواضعك رغم نجاحاتك كيزيدك هيبة.',en:'Your humility despite success adds to your greatness.'},
 {ar:'عينيك كينطقو بالذكاء والنعومة.',en:'Your eyes reflect intelligence and gentleness.'},
 {ar:'طريقتك ف حل المشاكل كتستحق التقدير.',en:'Your problem-solving skills deserve praise.'},
 {ar:'كتعرف متى تتكلم ومتى تسمع.',en:'You know when to speak and when to listen.'},
 {ar:'الوفاء ديالك للناس كبير بزاف.',en:'Your loyalty to others is remarkable.'},
 {ar:'عندك كاريزما مميزة ك تجذب انتباه الناس.',en:'You have a unique charisma that attracts people.'},
 {ar:'العدل ديالك وحكمك المنصف كيخليك محل ثقة.',en:'Your fairness makes you trustworthy.'},
 {ar:'كتحترم الوقت والتزاماتك دائماً.',en:'You always respect time and commitments.'},
 {ar:'كتدير الخير بلا ما تتكلم عليه.',en:'You do good quietly without showing off.'},
 {ar:'عقلك كبير وكتعرف تقيم الأمور بصواب.',en:'You are wise and evaluate things maturely.'},
 {ar:'شخصيتك المرحة كتحيد النكد.',en:'Your joyful nature removes sadness.'},
 {ar:'عندك شجاعة تقول الحق مهما كان صعب.',en:'You have the bravery to speak the truth.'},
 {ar:'كتدعم الناس وبلا ما تحسسهم بالضعف.',en:'You support others without making them feel weak.'},
 {ar:'طريقتك ف الوقوف كتعكس ثقة كبيرة.',en:'Your posture reflects supreme confidence.'},
 {ar:'كتعرف تحافظ على أسرار الناس ب أمانة.',en:'You keep people’s secrets faithfully.'},
 {ar:'نظرتك للمستقبل فيها أمل كبير.',en:'Your outlook on the future is filled with hope.'},
 {ar:'حضورك دافئ وكيخلي الواحد يحس بالأمان.',en:'Your warmth makes people feel safe.'},
 {ar:'كتستغل وقتك أفضل استغلال.',en:'You make the absolute best use of your time.'},
 {ar:'حسك الإنساني العالي كيجعلك قريب للقلب.',en:'Your deep humanity makes you beloved.'},
 {ar:'كتعرف تعبر على مشاعرك بصدق.',en:'You express your feelings genuinely.'},
 {ar:'عندك قدرة على التعلم السريع والإتقان.',en:'You learn quickly and master fast.'},
 {ar:'أفكارك دايماً كيكونوا خارج الصندوق.',en:'Your ideas are always outside the box.'},
 {ar:'حياك وحشمتك زايدينك وقار.',en:'Your modesty adds to your dignity.'},
 {ar:'كتعرف تبسط الأمور المعقدة.',en:'You simplify complex matters easily.'},
 {ar:'حبك للمساعدة كيجعلك بطل ف نظر الباقي.',en:'Your helpfulness makes you a hero to many.'},
 {ar:'عندك حس فني وجمالي راقي.',en:'You have refined artistic taste.'},
 {ar:'كتواجه التحديات بابتسامة وقوة.',en:'You face challenges with a smile and strength.'},
 {ar:'تفكيرك المنطقي كينقذ مواقف كتيرة.',en:'Your logical thinking saves many situations.'},
 {ar:'طريقتك ف النقد بناءة ومحترمة.',en:'Your feedback is always constructive.'},
 {ar:'دايماً متجدد وعندك أفكار جديدة.',en:'You are always fresh with new ideas.'},
 {ar:'كتعطي القيمة لكل فرصة كتحل لك.',en:'You appreciate every opportunity that comes.'},
 {ar:'عندك روح انضباط جيدة ف خدمتك.',en:'You show great discipline in your work.'},
 {ar:'شجاعتك ف الاعتراف بالخطأ ميزة كبار.',en:'Admitting mistakes shows true greatness.'},
 {ar:'كتعرف تعطي المكانة المستحقة لكل شخص.',en:'You value everyone appropriately.'},
 {ar:'اهتمامك بالتفاصيل كيدير فرق كبير.',en:'Your attention to detail makes a big difference.'},
 {ar:'قدرتك على تجاوز الماضي كتعطيك قوة.',en:'Moving past the past gives you power.'},
 {ar:'نظافة قلبك كتعكس على بشاشتك.',en:'The purity of your heart shines on your face.'},
 {ar:'كتعرف توازن بين العقل والعاطفة.',en:'You balance logic and emotions wonderfully.'},
 {ar:'أسلوب حياتك مصدر إلهام.',en:'Your lifestyle is an inspiring example.'},
 {ar:'كتشجع الآخرين حتى يوصلو للقمة.',en:'You encourage others to reach the top.'},
 {ar:'عندك حس الفكاهة راقي وبلا تجريح.',en:'Your humor is witty and kind.'},
 {ar:'كلامك دايماً كيبني وما كيهدمش.',en:'Your words always build, never destroy.'},
 {ar:'طريقتك ف إدارة الضغط كتعلم منها.',en:'How you handle stress is educational.'},
 {ar:'كتعرف كيفاش تخلي كل نهار مميز.',en:'You know how to make every day special.'},
 {ar:'ثقافتك الواسعة كتخلي النقاش ممتع.',en:'Your vast knowledge makes conversations rich.'},
 {ar:'شخصيتك المستقلة كتميزك.',en:'Your independent mind makes you distinct.'},
 {ar:'كتعرف تحمي حدودك بأدب.',en:'You set boundaries respectfully.'},
 {ar:'إصرارك على النجاح هو لي كيحقق الأهداف.',en:'Your persistence brings real achievements.'},
 {ar:'عندك نظرة ثاقبة وكتعرف الناس.',en:'You have great insight into human nature.'},
 {ar:'كتخلي أي واحد يحس بأهميته.',en:'You make everyone feel valued.'},
 {ar:'طاقتك كتحيي المكان.',en:'Your energy brings the room to life.'},
 {ar:'كتتعامل مع الجميع بنفس الاحترام.',en:'You treat everyone with equal respect.'},
 {ar:'حبك للتعلم كيزيدك معرفة.',en:'Your love for learning expands your mind.'},
 {ar:'شخصيتك الواضحة مريحة جداً.',en:'Your straightforwardness is refreshing.'},
 {ar:'كتعرف تستمتع باللحظات البسيطة.',en:'You appreciate life’s simple moments.'},
 {ar:'قدرتك على التسامح كتعطيك سلام داخلي.',en:'Forgiveness gives you inner peace.'},
 {ar:'قلبك الأبيض هو أكبر ثروة عندك.',en:'Your pure heart is your greatest asset.'},
 {ar:'انت شخص كيتوثق فيه ف أوقات الشدة.',en:'You are dependable in hard times.'},
 {ar:'وجودك ف الحياة نعمة للناس لي كيحبوك.',en:'Your existence is a blessing to those who love you.'}
];

const quotesList = [
 {ar:'خطوة صغيرة اليوم أحسن من خطة كبيرة بلا بداية.',en:'A small step today beats a big plan that never starts.'},
 {ar:'ركز على اللي تقدر تبدلو اليوم.',en:'Focus on what you can change today.'},
 {ar:'التقدم كيحتاج الصبر والتكرار.',en:'Progress takes patience and consistency.'},
 {ar:'لا تقارن بدايتك بموسم حصاد غيرك.',en:'Don’t compare your beginning to someone else’s harvest.'},
 {ar:'الفشل هو مجرد فرصة للبداية من جديد بشكل أذكى.',en:'Failure is simply the opportunity to begin again more intelligently.'},
 {ar:'سرك هو أسيرك، إذا تكلمتي بيه وليتي أنت أسيرو.',en:'Your secret is your prisoner; if you let it go, you become its prisoner.'},
 {ar:'اللي بغا العسل يصبر لقريص النحل.',en:'He who wants honey must endure bee stings.'},
 {ar:'كل نهار جديد هو صفحة بيضاء ف حياتك.',en:'Every new day is a blank page in your life.'},
 {ar:'التردد كياكل الوقت والأفكار.',en:'Hesitation consumes time and ideas.'},
 {ar:'الوقت كالسيف، إن لم تقطعه قطعك.',en:'Time is like a sword; if you don’t cut it, it cuts you.'},
 {ar:'من لم يتعلم من الماضي، يكرر أخطاءه ف المستقبل.',en:'Those who don’t learn from the past repeat its mistakes.'},
 {ar:'القناعة كنز لا يفنى.',en:'Contentment is an inexhaustible treasure.'},
 {ar:'العقل زينة والكلمة الطيبة صدقة.',en:'Wisdom is an ornament, and a kind word is charity.'},
 {ar:'لا تحكم على الكتاب من غلافه.',en:'Don’t judge a book by its cover.'},
 {ar:'الشجرة الملمرة هي اللي كيرميوها الناس بالحجر.',en:'Only fruitful trees are pelted with stones.'},
 {ar:'الصبر مفتاح الفرج.',en:'Patience is the key to relief.'},
 {ar:'اللي جرا مع الزمن كيعيا، واللي جرا مع حقو كيوصل.',en:'He who chases time tires; he who chases truth arrives.'},
 {ar:'العلم نور والجهل عار.',en:'Knowledge is light, ignorance is a shame.'},
 {ar:'ما طار طير وارتفع إلا كما طار وقع.',en:'Whatever rises high must eventually come down.'},
 {ar:'لسانك حصانك، إن صنته صانك وإن خنته خانك.',en:'Your tongue is your horse; guard it and it guards you.'},
 {ar:'التغيير يبدأ من الداخل أولاً.',en:'Change starts from within first.'},
 {ar:'الصديق وقت الضيق.',en:'A friend in need is a friend indeed.'},
 {ar:'أفضل طريقة للتنبؤ بالمستقبل هي صناعته.',en:'The best way to predict the future is to create it.'},
 {ar:'الحياة تجارب، واللي ما تعلم ببلاش كيتعلم بالثمن.',en:'Life is lessons; if not learned free, learned through price.'},
 {ar:'لا تجعل كلام الناس يؤثر ف طموحك.',en:'Don’t let people’s talk limit your ambition.'},
 {ar:'النجاح ليس محطة، بل هو رحلة مستمرة.',en:'Success is not a destination, but a journey.'},
 {ar:'الأفعال تتكلم بصوت أعلى من الكلمات.',en:'Actions speak louder than words.'},
 {ar:'من طلب العلا سهر الليالي.',en:'He who seeks greatness stays up through nights.'},
 {ar:'النية الصافية كتوصل دائماً لخير.',en:'Pure intentions always lead to good outcomes.'},
 {ar:'لا تؤجل عمل اليوم إلى الغد.',en:'Do not put off until tomorrow what you can do today.'},
 {ar:'من خاف سلم، ومن تجرأ فاز.',en:'He who cautions survives; he who dares wins.'},
 {ar:'اليد الواحدة ما تصفقش، التعاون أساس النجاح.',en:'One hand cannot clap; teamwork builds success.'},
 {ar:'الجمال جمال الروح وليس الجسد.',en:'Real beauty lies in the soul, not the body.'},
 {ar:'كل مشكلة وعندها حل، غير صبر وتفكر مزيان.',en:'Every problem has a solution; be patient and think.'},
 {ar:'الطريق الطويل يبدأ بفرسخة واحدة.',en:'A journey of a thousand miles begins with a single step.'},
 {ar:'من زرع حصد، ومن سار على الدرب وصل.',en:'He who sows reaps, he who walks the path arrives.'},
 {ar:'العين لا تعلو على الحاجب، الاحترام واجب.',en:'Respect is always mandatory.'},
 {ar:'الضربة اللي ما تقتلكش كتقويك.',en:'What doesn’t kill you makes you stronger.'},
 {ar:'كن كالنخيل عن الأحقاد مرتفعاً.',en:'Be like a palm tree, high above resentment.'},
 {ar:'راحة البال تبدأ من عدم التدخل فيما لا يعنيك.',en:'Peace of mind starts by minding your own business.'},
 {ar:'الكلمة الطيبة تفتح الأبواب المغلقة.',en:'A kind word opens locked doors.'},
 {ar:'لا تثق بالبدايات، العبرة دائماً بالنهايات.',en:'Don’t trust beginnings; results matter at the end.'},
 {ar:'الصحة تاج على رؤوس الأصحاء.',en:'Health is a crown on the healthy.'},
 {ar:'تفاءلوا بالخير تجدوه.',en:'Be optimistic about good things and you will find them.'},
 {ar:'من تواضع لله رفعه.',en:'He who is humble is elevated.'},
 {ar:'التجارب القاسية كتصنع الرجال الأقوياء.',en:'Hard times create strong individuals.'},
 {ar:'ما فات مات، واليوم ملكك.',en:'The past is gone; today belongs to you.'},
 {ar:'لا تقل ما لا تعلم، ولا تجحد ما تعلم.',en:'Don’t claim what you don’t know.'},
 {ar:'المال يروح ويجي، لكن الأخلاق كيبقاو.',en:'Money comes and goes, but character stays.'},
 {ar:'الحسد ياكل الحسنات كما تاكل النار الحطب.',en:'Envy eats good deeds like fire consumes wood.'},
 {ar:'كن أنت التغيير الذي تريد أن تراه ف العالم.',en:'Be the change you wish to see in the world.'},
 {ar:'العمل العبادة، والإتقان أساس القبول.',en:'Work is worship; mastery is the standard.'},
 {ar:'ليس العيب أن تسقط، بل العيب أن تبق ساقطاً.',en:'Falling is not the shame; staying down is.'},
 {ar:'الجمال بلا عقل كوردة بلا عبير.',en:'Beauty without mind is like a flower without scent.'},
 {ar:'الأمل هو الشمعة التي تضيء ظلمات الحياة.',en:'Hope is the candle lighting life’s darkness.'},
 {ar:'كل إناء بما فيه ينضح.',en:'Every vessel spills what it contains.'},
 {ar:'الحقيقة مرّة، لكن نتائجها دائماً حلوة.',en:'Truth is bitter, but its fruit is sweet.'},
 {ar:'الشجاعة ليست غياب الخوف، بل القيد عليه.',en:'Courage is not absence of fear, but control over it.'},
 {ar:'لا تبكِ على اللبن المسكوب.',en:'Don’t cry over spilled milk.'},
 {ar:'احذر صديقك مرة، واحذر عدوك ألف مرة.',en:'Be cautious with friends, doubly with enemies.'},
 {ar:'اللي عينو ف شي حاجة كيوصل ليها بالإصرار.',en:'Focused determination reaches any goal.'},
 {ar:'العقل السليم ف الجسم السليم.',en:'A sound mind resides in a sound body.'},
 {ar:'من قل كلامه قل خطؤه.',en:'Fewer words mean fewer mistakes.'},
 {ar:'الابتسامة هي أقصر طريق بين شخصين.',en:'A smile is the shortest distance between two people.'},
 {ar:'إذا حُرمت من شيء فاعلم أن الله أعد لك الأفضل.',en:'If denied something, trust a better thing is prepared.'},
 {ar:'الوفاء شيمة الكبار.',en:'Loyalty is the trait of noble minds.'},
 {ar:'الهروب من المشكلة ليس حلاً لها.',en:'Running from a problem never solves it.'},
 {ar:'الحياة مدرسة، والاستاذ فيها هو الزمن.',en:'Life is a school; time is the teacher.'},
 {ar:'من كثر لغطه كثر غلطه.',en:'Excessive talk leads to excessive error.'},
 {ar:'لا تكثر من الشكوى فيأتيك الهم.',en:'Don’t over-complain or grief will follow.'},
 {ar:'حبل الكذب قصير.',en:'The rope of lying is short.'},
 {ar:'الاعتراف بالحق فضيلة.',en:'Admitting truth is a virtue.'},
 {ar:'من يستعجل الأمور يعاقب بحرمانها.',en:'Hurrying things prematurely loses them.'},
 {ar:'البيت بلا كتاب كالجسد بلا روح.',en:'A house without books is like a body without soul.'},
 {ar:'المعرفة قوة، والاستخدام الصحيح لها حكمة.',en:'Knowledge is power; wise application is wisdom.'},
 {ar:'كن شكوراً لما لديك، وستحصل على المزيد.',en:'Be thankful for what you have and get more.'},
 {ar:'الشح والبخل يفسدان العلاقات.',en:'Greed destroys relationships.'},
 {ar:'المرء على دين خليله.',en:'A person reflects their closest friends.'},
 {ar:'العظمة ف الحياة هي النهوض كل مرة نسقط فيها.',en:'Greatness is rising every time we fall.'},
 {ar:'من خاف من الصعود عاش أبد الدهر بين الحفر.',en:'He who fears climbing lives forever in pits.'},
 {ar:'إذا أردت أن تطاع فأمر بما يستطاع.',en:'If you want obedience, order what is possible.'},
 {ar:'قطرة الماء تفتت الصخر بالتكرار.',en:'Water drops carve stone through repetition.'},
 {ar:'التسامح هو أكبر الانتقام.',en:'Forgiveness is the ultimate victory.'},
 {ar:'الخير ف القادم دائماً بإذن الله.',en:'The best is always yet to come.'},
 {ar:'كل مسؤول على أفعالو.',en:'Everyone is responsible for their own actions.'},
 {ar:'الاستغفار يفتح الأبواب المغلقة.',en:'Seeking grace opens closed doors.'},
 {ar:'الوقت كفيل بتهدئة كل العواصف.',en:'Time settles all storms.'},
 {ar:'الصراحة راحة، وإن كانت مؤلمة.',en:'Honesty is relief, even if painful.'},
 {ar:'اجعل أهدافك واقعاً يتحقق.',en:'Turn your goals into living reality.'},
 {ar:'القوة تأتي من الإرادة الصلبة.',en:'Strength comes from an indomitable will.'},
 {ar:'الاحترام يفرض ولا يطلب.',en:'Respect is earned, not demanded.'},
 {ar:'من حفظ لسانه أمن زلـله.',en:'He who guards his tongue avoids slips.'},
 {ar:'نهاية شيء هي بداية لشيء آخر أفضل.',en:'The end of one thing is the start of better.'}
];

export function dayKey(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Casablanca',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function privateMedia(message){if(!message||typeof message!=='object')return false;for(const [key,value]of Object.entries(message)){if(key.startsWith('viewOnceMessage'))return true;if(value&&typeof value==='object'){if(value.viewOnce===true||value.contextInfo?.expiration>0)return true;if((key==='ephemeralMessage'||key==='message')&&privateMedia(value))return true;}}return false;}
function targetGiven(c){return !!(c.info?.mentionedJid?.length||c.info?.participant||c.args?.some(x=>/^\+?\d{8,15}$/.test(x)));}

export async function extra(bot,c,{mediaBytes,textOf,profilePortrait}){
 const {e,command:cmd}=c,ar=c.language==='ar',s=bot.store.get(e.id),say=text=>bot.say(c,text),group=()=>bot.group(bot.store.get(e.id),c.chat);const text=c.arg||textOf(c.info?.quotedMessage);const copyValue=(value,label='Copy')=>typeof bot.sessions.copy==='function'?bot.copy(c,'✦ '+cmd+'\n```\n'+value+'\n```',[{label,value}]):say(value);
 
 switch(cmd){
 case 'members':{return say(c.meta.subject+'\n'+c.participants.map((p,i)=>(i+1)+'. '+(group().nicknames?.[numberOf(p.resolved)]||numberOf(p.resolved))+(p.admin?' 👑':'')).join('\n'));}
 case 'requests':{const list=await e.sock.groupRequestParticipantsList(c.chat);const items=await Promise.all(list.slice(0,100).map(async(p,i)=>{const resolved=await bot.sessions.identity(e,p.jid,p.phoneNumber);const id=resolved.endsWith('@s.whatsapp.net')?numberOf(resolved):p.jid;return (i+1)+'. '+id+'\n'+c.prefix+'accept '+id+' / '+c.prefix+'reject '+id;}));return say(items.length?items.join('\n'):(ar?'ما كاين حتى طلب.':'No pending join requests.'));}
 case 'accept':case 'reject':{const list=await e.sock.groupRequestParticipantsList(c.chat);let request;const native=c.arg.match(/^\d+@(lid|s\.whatsapp\.net)$/);if(native)request=list.find(p=>normalize(p.jid)===normalize(c.arg));else{const target=await bot.target(c);for(const p of list){const resolved=await bot.sessions.identity(e,p.jid,p.phoneNumber);if(normalize(p.jid)===normalize(target.jid)||normalize(resolved)===normalize(target.resolved)||numberOf(resolved)===target.id){request=p;break;}}}if(!request)throw Error('No pending request for this member.');const result=await e.sock.groupRequestParticipantsUpdate(c.chat,[request.jid],cmd==='accept'?'approve':'reject');if(!result.length||result.some(r=>String(r.status)!=='200'))throw Error('WhatsApp rejected the request action.');e.groups.delete(c.chat);return say(cmd==='accept'?'Request approved. / تم القبول.':'Request rejected. / تم الرفض.');}
 case 'groupavatar':{const photo=await profilePortrait(e.sock,c.chat);return bot.sessions.send(e,c.chat,{image:photo.buffer},{quoted:c.m});}
 case 'setgroupavatar':{const source=c.info?.quotedMessage||c.m.message;if(privateMedia(source))throw Error('Ask the sender to resend an ordinary image.');const image=await mediaBytes(source);if(image.type!=='imageMessage')throw Error('Reply to an image.');await e.sock.updateProfilePicture(c.chat,image.buffer);return say('Group photo updated. / تبدلات صورة المجموعة.');}
 case 'rules':return say(group().rules||(ar?'الأدمن يحدد القوانين بـ'+c.prefix+'قوانين_تعيين النص':'Admins can set rules with '+c.prefix+'setrules <text>'));
 case 'setrules':{if(!c.arg||c.arg.length>3000)throw Error('Rules must be 1–3000 characters.');bot.store.change(e.id,x=>bot.group(x,c.chat).rules=c.arg);return say('Rules saved. / تحفّظات القوانين.');}
 case 'nick':case 'delnick':{const target=targetGiven(c)?await bot.target(c):{id:c.uid,participant:c.participants.find(p=>numberOf(p.resolved)===c.uid)};if(!target.participant)throw Error('Target is not in this group.');if(target.id!==c.uid)bot.requireAdmin(c);let name=c.args.filter(x=>!x.startsWith('@')&&!/^\+?\d{8,15}$/.test(x)).join(' ');if(cmd==='nick'&&(!name||name.length>32))throw Error('Nickname must be 1–32 characters.');bot.store.change(e.id,x=>{const g=bot.group(x,c.chat);g.nicknames??={};if(cmd==='nick'&&!g.nicknames[target.id]&&Object.keys(g.nicknames).length>=3000)throw Error('Nickname storage is full. Remove old nicknames first.');if(cmd==='delnick')delete g.nicknames[target.id];else g.nicknames[target.id]=name;});return say(cmd==='nick'?'Nickname saved: '+name:'Nickname removed. / تم حذف اللقب.');}
 case 'mynick':return say(group().nicknames?.[c.uid]||(ar?'ما عندكش لقب.':'No nickname saved.'));
 case 'nicks':{const names=group().nicknames||{};return say(Object.entries(names).map(([id,name])=>id+' — '+name).join('\n')||(ar?'ما كاينينش ألقاب.':'No saved nicknames.'));}
 case 'checkin':{const day=dayKey();bot.store.change(e.id,x=>{const g=bot.group(x,c.chat);if(g.attendance?.day!==day)g.attendance={day,users:{}};g.attendance.users[c.uid]??=Date.now();});return say(ar?'تسجل الحضور ديالك اليوم.':'Your attendance is recorded for today.');}
 case 'attendance':{const a=group().attendance;if(a?.day!==dayKey())return say('No attendance today. / ما كاين حضور اليوم.');return say(a.day+'\n'+Object.keys(a.users).map((id,i)=>(i+1)+'. '+(group().nicknames?.[id]||id)).join('\n'));}
 case 'resetattendance':bot.store.change(e.id,x=>delete bot.group(x,c.chat).attendance);return say('Today’s attendance cleared. / تم مسح الحضور.');
 case 'warnlimit':{const n=Number(c.arg);if(!Number.isInteger(n)||n<1||n>10)throw Error('Warning limit: 1–10.');bot.store.change(e.id,x=>bot.group(x,c.chat).warnLimit=n);return say('Warning limit: '+n);}
 case 'clearwarns':{const t=await bot.target(c);bot.store.change(e.id,x=>delete bot.group(x,c.chat).warnings[t.id]);return say('Warnings cleared. / تم مسح الإنذارات.');}
 case 'allwarnings':return say(Object.entries(group().warnings).filter(([,n])=>n>0).map(([id,n])=>id+' — '+n+'/'+(group().warnLimit||3)).join('\n')||'No warnings. / ما كاينينش إنذارات.');
 case 'schedule':{const match=c.arg.match(/^(open|close|فتح|قفل|إغلاق)\s+(\d+)(m|h|d)$/);if(!match)throw Error('Use '+c.prefix+'schedule open|close 30m');const delay=Number(match[2])*{m:60000,h:3600000,d:DAY}[match[3]];if(delay<60000||delay>7*DAY)throw Error('Schedule range: 1 minute–7 days.');const job={id:crypto.randomUUID().slice(0,8),chat:c.chat,by:c.uid,action:['open','فتح'].includes(match[1])?'open':'close',at:Date.now()+delay};bot.store.change(e.id,x=>{x.groupJobs??=[];if(x.groupJobs.length>=50)throw Error('Maximum 50 pending group jobs.');x.groupJobs.push(job);});return say('Group schedule saved: '+job.id+' · '+job.action);}
 case 'schedules':return say((s.groupJobs||[]).filter(x=>x.chat===c.chat).map(x=>x.id+' · '+x.action+' · '+new Date(x.at).toLocaleString('en-GB',{timeZone:'Africa/Casablanca'})).join('\n')||'No group schedules. / لا توجد جدولة.');
 case 'cancelschedule':bot.store.change(e.id,x=>x.groupJobs=(x.groupJobs||[]).filter(j=>j.chat!==c.chat||j.id!==c.arg));return say('Schedule removed if found in this group.');
 case 'weekly':case 'monthly':{const interval=cmd==='weekly'?7*DAY:30*DAY,reward=cmd==='weekly'?3000:12000,key=cmd==='weekly'?'lastWeekly':'lastMonthly';const u=bot.store.change(e.id,x=>{const u=user(x,c.uid);if(u[key]&&Date.now()-u[key]<interval)throw Error('Reward ready in '+Math.ceil((interval-(Date.now()-u[key]))/3600000)+' hours.');if(!Number.isSafeInteger(u.wallet+reward))throw Error('Wallet limit reached.');u.wallet+=reward;u[key]=Date.now();return u;});return say('+'+reward+' virtual coins · Wallet: '+u.wallet);}
 case 'wordcount':{if(!text||text.length>8000)throw Error('Provide text or reply (max 8000 characters).');return say('Characters / الحروف: '+[...text].length+'\nWords / الكلمات: '+text.trim().split(/\s+/u).length+'\nLines / الأسطر: '+text.split('\n').length);}
 case 'base64':if(!text||text.length>4000)throw Error('Provide 1–4000 characters.');return copyValue(Buffer.from(text).toString('base64'),'Copy Base64');
 case 'unbase64':{if(!text||text.length>6000||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(text))throw Error('Invalid Base64.');const value=Buffer.from(text,'base64').toString('utf8');if(value.includes('\ufffd'))throw Error('Decoded content is not UTF-8 text.');return copyValue(value,'Copy text');}
 case 'hash':if(!text||text.length>8000)throw Error('Provide text (max 8000 characters).');return copyValue(crypto.createHash('sha256').update(text).digest('hex'),'Copy SHA-256');
 case 'password':{if(c.isGroup)throw Error('Generate passwords in private chat only.');const n=c.arg?Number(c.arg):20;if(!Number.isInteger(n)||n<8||n>64)throw Error('Password length: 8–64.');const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*+-=';return copyValue(Array.from({length:n},()=>chars[crypto.randomInt(chars.length)]).join(''),'Copy password');}
 case 'choose':{const options=c.arg.split('|').map(x=>x.trim()).filter(Boolean);if(options.length<2||options.length>20||options.some(x=>x.length>200))throw Error('Choose between 2–20 options separated by |.');return say(pick(options));}
 case 'time':return say(new Date().toLocaleString(ar?'ar-MA':'en-GB',{timeZone:'Africa/Casablanca',dateStyle:'full',timeStyle:'medium'})+'\nAfrica/Casablanca');
 case 'vp':
 case 'vpp':
 case 'كشف':
 case 'كشف_خاص':{
  const source=c.info?.quotedMessage;
  if(!source)return;
  const viewOnceMsg=source.viewOnceMessageV2?.message||source.viewOnceMessage?.message||source.viewOnceMessageV2Extension?.message||(privateMedia(source)?source:null);
  if(!viewOnceMsg)return;
  try{
   const media=await mediaBytes(viewOnceMsg);
   if(['imageMessage','videoMessage','audioMessage'].includes(media.type)){
    const senderJid = c.sender || c.uid;
    const targetChat = (cmd === 'vpp' || cmd === 'كشف_خاص') 
      ? (senderJid.includes('@') ? senderJid : `${senderJid}@s.whatsapp.net`) 
      : c.chat;

    let content={};
    if(media.type==='imageMessage')content={image:media.buffer};
    else if(media.type==='videoMessage')content={video:media.buffer,mimetype:media.data?.mimetype||'video/mp4'};
    else if(media.type==='audioMessage')content={audio:media.buffer,mimetype:'audio/mp4',ptt:true};
    return await bot.sessions.send(e,targetChat,content);
   }
  }catch(err){return;}
  return;
 }
 case 'compliment':{
  const item = pick(complimentsList);
  return say(ar ? item.ar : item.en);
 }
 case 'quote':{
  const item = pick(quotesList);
  return say(ar ? item.ar : item.en);
 }
 }
}