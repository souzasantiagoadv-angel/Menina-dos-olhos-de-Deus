CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar TEXT DEFAULT '🐝',
  age INT DEFAULT 8,
  favorite_categories TEXT[] DEFAULT '{}',
  parental_filter BOOLEAN DEFAULT TRUE,
  parental_pin TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  testament TEXT NOT NULL CHECK (testament IN ('velho','novo')),
  category TEXT NOT NULL,
  emoji TEXT DEFAULT '📖',
  text TEXT NOT NULL,
  age_min INT DEFAULT 6
);

CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  testament TEXT NOT NULL CHECK (testament IN ('velho','novo')),
  category TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  age_min INT DEFAULT 6
);

CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  testament TEXT NOT NULL CHECK (testament IN ('velho','novo')),
  category TEXT NOT NULL,
  emoji TEXT DEFAULT '🧠',
  questions JSONB NOT NULL,
  age_min INT DEFAULT 6
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

TRUNCATE stories, videos, quizzes RESTART IDENTITY CASCADE;

INSERT INTO stories (title, testament, category, emoji, text, age_min) VALUES
('A Criação do Mundo', 'velho', 'Criação', '🌍',
'Deus criou o mundo todo em seis dias! Primeiro, a luz e o escuro. Depois, o céu e o mar. Depois, as plantinhas, as árvores, o sol, a lua e as estrelinhas. No quinto dia vieram os peixinhos e os passarinhos. No sexto dia vieram os animais — e, por fim, o homem e a mulher, para cuidarem de tudo. E Deus viu que tudo era muito bom! No sétimo dia, Deus descansou, e é por isso que temos um dia especial da semana para descansar também.', 6),
('Noé e a Grande Arca', 'velho', 'Obediência', '🚢',
'Deus pediu para Noé construir uma arca bem grande, porque ia chover muito, muito tempo. Noé obedeceu e construiu a arca com sua família. Entraram dois de cada tipo de animal: leões, elefantes, girafas, cobras, pombinhos! Choveu quarenta dias e quarenta noites. Depois, a arca flutuou até as águas baixarem. Noé soltou uma pomba, que voltou com uma folhinha verde: a terra estava seca! Deus fez um arco-íris no céu como promessa de que nunca mais inundaria a Terra inteira.', 6),
('José e as Bolas de Cores', 'velho', 'Perdão', '🌈',
'José era o menino favorito do pai, e ganhou uma túnica linda e colorida. Seus irmãos ficaram com muita inveja e o venderam como escravo, longe de casa. Mesmo passando por dificuldades, José confiou em Deus e ajudou o rei do Egito a entender sonhos. Um dia, seus irmãos apareceram pedindo comida, porque havia fome. José podia se vingar... mas perdoou todos e abraçou a família, dizendo: "Vocês planejaram uma coisa ruim, mas Deus transformou em uma coisa boa".', 8),
('Moisés e o Mar Vermelho', 'velho', 'Milagres', '🌊',
'O povo de Deus era escravo no Egito. Deus escolheu Moisés para ir ao faraó e dizer: "Deixa meu povo ir!". Depois de dez pragas, o faraó deixou — mas logo mudou de ideia e correu atrás deles com seu exército. O mar estava na frente e os soldados atrás! Moisés levantou a mão, e Deus abriu o mar em dois, formando paredes de água. O povo atravessou no meio do mar, com a terra seca! Quando os soldados entraram, as águas voltaram. Foi um grande milagre!', 6),
('Davi e o Gigante Golias', 'velho', 'Coragem', '🪨',
'Golias era um gigante de quase três metros que assustava o exército de Israel todos os dias. Ninguém tinha coragem de enfrentá-lo — ninguém, exceto um pastorzinho chamado Davi! Davi não quis armadura nem espada. Pegou sua funda e cinco pedrinhas do rio e disse: "O Senhor me livrou do leão e do urso, e vai me livrar deste gigante". Davi acertou uma pedrinha na testa de Golias, e o gigante caiu! Com Deus, até os pequenos podem vencer coisas grandes.', 8),
('Daniel na Cova dos Leões', 'velho', 'Fé', '🦁',
'Daniel orava a Deus três vezes por dia, mesmo quando uma nova lei proibia orações. Por causa disso, foi jogado numa cova cheia de leões famintos! O rei ficou triste e passou a noite sem dormir. De manhã, gritou: "Daniel, o seu Deus te salvou?". Daniel respondeu da cova: "Sim! Deus enviou um anjo que fechou a boca dos leões!". O rei ficou muito feliz e decretou que todos deveriam respeitar o Deus de Daniel.', 6),
('Jonas e o Grande Peixe', 'velho', 'Obediência', '🐟',
'Deus pediu para Jonas ir pregar na cidade de Nínive. Mas Jonas fugiu de navio para o outro lado! Uma tempestade enorme veio, e Jonas foi jogado no mar. Aí, um grande peixe o engoliu! Dentro do peixe, por três dias, Jonas orou e pediu perdão a Deus. O peixe o devolveu na praia, e dessa vez Jonas foi até Nínive e pregou. Todo mundo se arrependeu — até os animais jejuaram! Deus é o Deus de todos, até dos que tentam fugir dele.', 6),
('O Nascimento de Jesus', 'novo', 'Natal', '⭐',
'Maria e José viajaram até Belém, e lá não havia mais lugar na hospedaria. Então o bebê Jesus nasceu numa estrebaria, e foi deitado numa manjedoura, na palha. Naquela noite, anjos apareceram aos pastores anunciando: "Hoje nasceu o Salvador!". E uma estrela brilhante guiou os Reis Magos de bem longe até o menino, trazendo presentes de ouro, incenso e mirra. O Filho de Deus nasceu humilde, como o maior presente de todos para o mundo.', 6),
('Jesus Acalma a Tempestade', 'novo', 'Milagres', '⛈️',
'Jesus e os discípulos estavam num barquinho quando veio uma tempestade assustadora. Os ventos uivavam, as ondas jogavam água para dentro do barco, e os discípulos ficaram apavorados. Jesus? Estava dormindo! Eles acordaram Jesus gritando: "Mestre, não te importa que pereçamos?". Jesus se levantou, olhou para o mar e disse: "Cala-te, emudece!". Na hora, o vento parou e fez-se uma grande calmaria. "Por que vocês têm tanto medo?", perguntou Jesus. Quem está com Jesus pode confiar mesmo na tempestade.', 6),
('A Multiplicação dos Pães', 'novo', 'Milagres', '🍞',
'Cinco mil pessoas estavam ouvindo Jesus, e ninguém tinha comida. Um menino ofereceu seu lanchinho: cinco pães de cevada e dois peixinhos. Era pouquíssimo! Mas Jesus agradeceu a Deus, abençoou a comida, e começou a distribuir. E os pães e peixes não acabavam nunca! Todo mundo comeu até ficar satisfeito, e ainda sobraram doze cestos cheios. Jesus pode fazer coisas grandes até com o pouquinho que oferecemos.', 6),
('O Bom Samaritano', 'novo', 'Parábolas', '🩹',
'Jesus contou a história de um homem que foi assaltado e machucado na estrada. Um sacerdote passou pela estrada... e foi embora. Depois, um levita passou... e também foi embora. Aí veio um samaritano — alguém de quem o homem não gostava — e ele parou! Cuidou dos ferimentos, colocou o homem no seu próprio animal e pagou hospedagem para ele se recuperar. Jesus perguntou: "Quem foi o próximo do homem ferido?". Amar o próximo é cuidar de quem precisa, de quem for que for.', 8),
('O Filho Pródigo', 'novo', 'Parábolas', '🎉',
'Um filho pediu a parte da herança ao pai e foi gastar tudo longe de casa, vivendo de festa. Quando o dinheiro acabou, ele teve que trabalhar comendo frutas de porco! Aí ele pensou: "Vou voltar para casa e pedir para ser só um empregado do meu pai". Mas quando ainda estava longe, o pai o avistou, correu, o abraçou e deu uma festa com anéis, roupa nova e bolo! O irmão mais velho ficou com ciúme, mas o pai explicou: "Meu filho estava perdido e foi encontrado! Ele estava morto e viveu de novo!". Deus celebra cada pessoa que volta para ele.', 8),
('Zaqueu, o Pequeno Cobrador', 'novo', 'Amizade', '🌳',
'Zaqueu era um cobrador de impostos rico, mas pequeno demais para ver Jesus por cima da multidão. Aí ele teve uma ideia: subir numa árvore! Quando Jesus passou, olhou para cima e disse: "Zaqueu, desce! Preciso ficar na sua casa hoje". Todo mundo se escandalizou — Zaqueu cobrava taxas a mais e ficava com o dinheiro! Mas depois de conhecer Jesus, Zaqueu se arrependeu: "Vou devolver quatro vezes mais para quem eu roubi!". Jesus disse: "Hoje a salvação entrou nesta casa, porque este homem também é filho de Abraão".', 8),
('A Páscoa de Jesus', 'novo', 'Páscoa', '✝️',
'Jesus foi para a cruz, mesmo sendo inocente. Lá, ele orou pelos que o crucificaram: "Pai, perdoa-os". Seus amigos ficaram muito tristes, e o corpo de Jesus foi posto num túmulo. Mas no terceiro dia, um grupo de mulheres foi ao túmulo e o encontrou aberto, com um anjo dentro anunciando: "Ele não está aqui! Ressuscitou!". Jesus estava vivo! Ele apareceu aos discípulos, comeram juntos, e Jesus prometeu que sempre estaria com eles. A Páscoa é a festa da vitória sobre a morte.', 8);

INSERT INTO videos (title, testament, category, youtube_id, age_min) VALUES
('No Começo — Superbook (T1 E1)', 'velho', 'Criação', 'ren9d_MBvPY', 6),
('Noé — Superbook (T2 E9)', 'velho', 'Obediência', 'bF3LuF5STEE', 6),
('Rute, Noemi e Boaz — Superbook (T3 E1)', 'velho', 'Família', 'Kx7wgitSFmY', 6),
('O Primeiro Natal — Superbook (T1 E8)', 'novo', 'Natal', '7nb50U07Bvc', 6),
('Os Milagres de Jesus — Superbook (T1 E9)', 'novo', 'Milagres', 'uAsKh2uA_74', 6),
('A Última Ceia — Superbook (T1 E10)', 'novo', 'Páscoa', 'SHq_FYj-esU', 8);

INSERT INTO quizzes (title, testament, category, emoji, questions, age_min) VALUES
('Histórias do Velho Testamento', 'velho', 'Velho Testamento', '📜', $$
[
 {"q": "Quantos dias Deus levou para criar o mundo?", "options": ["3 dias", "6 dias", "100 dias"], "answer": 1},
 {"q": "O que Noé construiu?", "options": ["Uma torre", "Uma arca", "Um castelo"], "answer": 1},
 {"q": "Quantos dias e noites choveu na arca de Noé?", "options": ["40", "7", "400"], "answer": 0},
 {"q": "O que Davi usou para vencer Golias?", "options": ["Uma espada", "Uma funda e pedrinhas", "Um escudo gigante"], "answer": 1},
 {"q": "Onde Daniel foi jogado?", "options": ["Na cova dos leões", "No mar", "Numa prisão egípcia"], "answer": 0}
]
$$::jsonb, 6),
('Heróis do Antigo Testamento', 'velho', 'Histórias', '🦸', $$
[{"q": "Quem foi vendido pelos irmãos e depois ajudou o Egito?", "options": ["José", "Moisés", "Sansão"], "answer": 0},
 {"q": "De quem o grande peixe engoliu?", "options": ["Pedro", "Jonas", "Paulo"], "answer": 1},
 {"q": "Quem abriu o Mar Vermelho com a mão levantada?", "options": ["Josué", "Moisés", "Aarão"], "answer": 1},
 {"q": "Quantos pedrinhas Davi pegou do rio?", "options": ["1", "5", "50"], "answer": 1},
 {"q": "O que Deus colocou no céu como promessa a Noé?", "options": ["Uma estrela", "Um arco-íris", "Uma nuvem"], "answer": 1}
]$$::jsonb, 8),
('Vida de Jesus', 'novo', 'Novo Testamento', '⭐', $$
[{"q": "Onde o bebê Jesus nasceu?", "options": ["Num palácio", "Numa estrebaria", "Num barco"], "answer": 1},
 {"q": "O que Jesus fez com a tempestade?", "options": ["Acalmou o mar", "Fugiu do barco", "Nada"], "answer": 0},
 {"q": "Com quantos pães Jesus alimentou 5 mil pessoas?", "options": ["5", "500", "5 mil"], "answer": 0},
 {"q": "Quem subiu numa árvore para ver Jesus?", "options": ["Pedro", "Zaqueu", "Tomé"], "answer": 1},
 {"q": "Quantos dias Jesus ficou no túmulo?", "options": ["1", "3", "7"], "answer": 1}
]$$::jsonb, 6),
('Parábolas de Jesus', 'novo', 'Parábolas', '🪴', $$
[{"q": "Quem cuidou do homem ferido na estrada?", "options": ["O sacerdote", "O samaritano", "O soldado"], "answer": 1},
 {"q": "O que o filho pródigo fez quando voltou?", "options": ["Escondeu-se", "Pediu perdão", "Comprou uma fazenda"], "answer": 1},
 {"q": "O que o pai fez ao ver o filho voltar?", "options": ["Brigou", "Abraçou e fez festa", "Ignorou"], "answer": 1},
 {"q": "O que Jesus ensinou com o bom samaritano?", "options": ["Amar o próximo", "Fugir da estrada", "Ganhar dinheiro"], "answer": 0},
 {"q": "O que o filho pródigo gastou longe de casa?", "options": ["A herança", "O semente", "A casa"], "answer": 0}
]$$::jsonb, 8);
