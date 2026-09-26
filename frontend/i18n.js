/* FreeForge i18n — client-side language auto-detect + timezone clock.
   English stays the default in the HTML (this is what Googlebot indexes).
   Visitors with another browser language get the UI swapped via data-i18n. */
var FF_LANGS = ['en','es','pt','fr','de','hi','id','bn','tr','it','nl'];
var FF_LANG_NAMES = {en:'English',es:'Español',pt:'Português',fr:'Français',de:'Deutsch',hi:'हिन्दी',id:'Bahasa Indonesia',bn:'বাংলা',tr:'Türkçe',it:'Italiano',nl:'Nederlands'};
var I18N = {
es: {
nav_studio:"Estudio", nav_blog:"Blog", nav_about:"Nosotros", nav_cta:"Empieza a crear — Gratis",
hero_t1:"Estudio de IA gratuito", hero_t2:"y herramientas online gratis",
hero_sub:"Crea imágenes con IA, chatea con la IA, genera voces, videos narrativos y más — además de herramientas gratuitas para el día a día: comprimir, unir o dividir PDFs, comprimir imágenes, calculadoras de edad, IMC y cuotas, conversor de unidades, contador de palabras, un quiz divertido, generador de contraseñas, resolvedor de anagramas, códigos QR y cuál es mi IP. 21 herramientas gratis, sin registro. Elige una y empieza — directo desde tu navegador.",
badge1:"✓ 100% GRATIS", badge2:"✓ SIN REGISTRO", badge3:"✓ SIN CLAVES API",
hero_cta1:"Empieza a crear — Es gratis", hero_cta2:"Aprende cómo →",
"tname-t-image":"Generador de imágenes IA", "tdesc-t-image":"Convierte palabras en arte. Fotorrealista, anime, 3D — cualquier estilo y tamaño, gratis.", "tab-t-image":"Imagen IA",
"tname-t-aichat":"Chat IA", "tdesc-t-aichat":"Pregunta lo que sea — respuestas instantáneas de la IA para ideas, tareas, escritura y más. Gratis, sin registro.", "tab-t-aichat":"Chat IA",
"tname-t-voice":"Generador de voz IA", "tdesc-t-voice":"Texto a voz realista con 8 voces — inglés, bengalí y hindi. Descarga el MP3.", "tab-t-voice":"Voz IA",
"tname-t-story":"Creador de videos narrativos", "tdesc-t-story":"La IA escribe tu historia, genera escenas, narra y monta un video con subtítulos. Listo para Shorts y Reels.", "tab-t-story":"Video narrativo",
"tname-t-rembg":"Eliminador de fondos", "tdesc-t-rembg":"Sube cualquier foto y obtén un recorte limpio con fondo transparente, gratis.", "tab-t-rembg":"Quitar fondo",
"tname-t-caption":"Generador de subtítulos y hashtags", "tdesc-t-caption":"Subtítulos y hashtags escritos por IA para Reels, TikTok y YouTube Shorts. Copia y publica.", "tab-t-caption":"Subtítulos",
"tname-t-quote":"Creador de citas y memes", "tdesc-t-quote":"Convierte cualquier frase en una tarjeta de cita de 1080×1080. Cuatro estilos de degradado.", "tab-t-quote":"Citas",
"tname-t-textvideo":"Texto a video", "tdesc-t-textvideo":"Describe una escena — la IA genera la imagen y añadimos movimiento suave para un video de 5 segundos.", "tab-t-textvideo":"Texto→Video",
"tname-t-animate":"Animador de fotos", "tdesc-t-animate":"Sube cualquier foto y conviértela en un video de 5 segundos con zoom y paneo cinematográficos.", "tab-t-animate":"Animador",
"tname-t-age":"Calculadora de edad", "tdesc-t-age":"Tu edad exacta en años, meses y días — además del día de la semana de tu nacimiento y la cuenta atrás de tu próximo cumpleaños.", "tab-t-age":"Edad",
"tname-t-bmi":"Calculadora de IMC", "tdesc-t-bmi":"Calcula tu índice de masa corporal al instante — categoría, rango saludable y qué significa.", "tab-t-bmi":"IMC",
"tname-t-emi":"Calculadora de cuotas", "tdesc-t-emi":"Cuota mensual, interés total y total a pagar de préstamos de vivienda, auto o personales.", "tab-t-emi":"Cuotas",
"tname-t-pdf":"Herramientas PDF", "tdesc-t-pdf":"Reduce el tamaño de PDFs, une varios en uno o extrae páginas — gratis y privado.", "tab-t-pdf":"PDF",
"tname-t-compress":"Compresor de imágenes", "tdesc-t-compress":"Reduce fotos JPG, PNG y WebP — cambia el tamaño y comprime manteniendo la calidad.", "tab-t-compress":"Comprimir",
"tname-t-unit":"Conversor de unidades", "tdesc-t-unit":"Longitud, peso, temperatura, área, velocidad y datos — convierte lo que sea al instante.", "tab-t-unit":"Unidades",
"tname-t-words":"Contador de palabras", "tdesc-t-words":"Palabras, caracteres, frases y tiempo de lectura para ensayos, publicaciones y artículos.", "tab-t-words":"Palabras",
"tname-t-quiz":"Quiz del creador", "tdesc-t-quiz":"¿Qué tipo de creador eres? 8 preguntas divertidas — obtén una tarjeta de resultado para compartir.", "tab-t-quiz":"Quiz",
"tname-t-password":"Generador de contraseñas", "tdesc-t-password":"Contraseñas fuertes y aleatorias con un toque — elige longitud, símbolos y números. Cópialas al instante.", "tab-t-password":"Contraseña",
"tname-t-anagram":"Resolvedor de anagramas", "tdesc-t-anagram":"Escribe letras — encuentra todos los anagramas y palabras posibles. Ideal para Scrabble y crucigramas.", "tab-t-anagram":"Anagramas",
"tname-t-qr":"Generador de códigos QR", "tdesc-t-qr":"Convierte cualquier enlace o texto en un código QR escaneable — descarga el PNG, gratis.", "tab-t-qr":"QR",
"tname-t-myip":"Cuál es mi IP", "tdesc-t-myip":"Ve tu dirección IP pública con un toque — cópiala para formularios y configuraciones.", "tab-t-myip":"Mi IP",
foot_blog:"Blog", foot_about:"Nosotros", foot_privacy:"Privacidad", foot_contact:"Contacto", foot_terms:"Términos",
foot_tag:"Estudio de IA gratuito y herramientas online gratis. 21 herramientas gratis: chat IA, imágenes, voces, videos narrativos, texto a video, animador de fotos, subtítulos, tarjetas de citas, herramientas PDF, compresor de imágenes, calculadoras, conversor de unidades, contador de palabras, quiz, generador de contraseñas, resolvedor de anagramas, generador QR y cuál es mi IP.",
ip_localtime:"Tu hora local"
},
pt: {
nav_studio:"Estúdio", nav_blog:"Blog", nav_about:"Sobre", nav_cta:"Comece a criar — Grátis",
hero_t1:"Estúdio de IA gratuito", hero_t2:"e ferramentas online grátis",
hero_sub:"Crie imagens com IA, converse com a IA, gere vozes, vídeos narrativos e muito mais — além de ferramentas gratuitas para o dia a dia: comprimir, unir ou dividir PDFs, comprimir imagens, calculadoras de idade, IMC e parcelas, conversor de unidades, contador de palavras, um quiz divertido, gerador de senhas, resolvedor de anagramas, códigos QR e qual é meu IP. 21 ferramentas grátis, sem cadastro. Escolha uma e comece — direto do seu navegador.",
badge1:"✓ 100% GRÁTIS", badge2:"✓ SEM CADASTRO", badge3:"✓ SEM CHAVES API",
hero_cta1:"Comece a criar — É grátis", hero_cta2:"Saiba como →",
"tname-t-image":"Gerador de imagens IA", "tdesc-t-image":"Transforme palavras em arte. Fotorrealista, anime, 3D — qualquer estilo e tamanho, grátis.", "tab-t-image":"Imagem IA",
"tname-t-aichat":"Chat IA", "tdesc-t-aichat":"Pergunte qualquer coisa — respostas instantâneas da IA para ideias, lição de casa, textos e mais. Grátis, sem cadastro.", "tab-t-aichat":"Chat IA",
"tname-t-voice":"Gerador de voz IA", "tdesc-t-voice":"Texto para fala realista com 8 vozes — inglês, bengali e hindi. Baixe o MP3.", "tab-t-voice":"Voz IA",
"tname-t-story":"Criador de vídeos narrativos", "tdesc-t-story":"A IA escreve sua história, gera cenas, narra e monta um vídeo legendado. Pronto para Shorts e Reels.", "tab-t-story":"Vídeo narrativo",
"tname-t-rembg":"Removedor de fundo", "tdesc-t-rembg":"Envie qualquer foto e obtenha um recorte limpo com fundo transparente, grátis.", "tab-t-rembg":"Remover fundo",
"tname-t-caption":"Gerador de legendas e hashtags", "tdesc-t-caption":"Legendas e hashtags escritas por IA para Reels, TikTok e YouTube Shorts. Copie e publique.", "tab-t-caption":"Legendas",
"tname-t-quote":"Criador de citações e memes", "tdesc-t-quote":"Transforme qualquer frase em um cartão de citação 1080×1080. Quatro estilos de gradiente.", "tab-t-quote":"Citações",
"tname-t-textvideo":"Texto para vídeo", "tdesc-t-textvideo":"Descreva uma cena — a IA gera a imagem e adicionamos movimento suave para um vídeo de 5 segundos.", "tab-t-textvideo":"Texto→Vídeo",
"tname-t-animate":"Animador de fotos", "tdesc-t-animate":"Envie qualquer foto e transforme-a em um vídeo de 5 segundos com zoom e panorâmica cinematográficos.", "tab-t-animate":"Animador",
"tname-t-age":"Calculadora de idade", "tdesc-t-age":"Sua idade exata em anos, meses e dias — além do dia da semana do seu nascimento e a contagem regressiva do próximo aniversário.", "tab-t-age":"Idade",
"tname-t-bmi":"Calculadora de IMC", "tdesc-t-bmi":"Calcule seu índice de massa corporal na hora — categoria, faixa saudável e o que significa.", "tab-t-bmi":"IMC",
"tname-t-emi":"Calculadora de parcelas", "tdesc-t-emi":"Parcela mensal, juros totais e total a pagar de empréstimos imobiliários, auto ou pessoais.", "tab-t-emi":"Parcelas",
"tname-t-pdf":"Ferramentas PDF", "tdesc-t-pdf":"Reduza o tamanho de PDFs, una vários em um só ou extraia páginas — grátis e privado.", "tab-t-pdf":"PDF",
"tname-t-compress":"Compressor de imagens", "tdesc-t-compress":"Reduza fotos JPG, PNG e WebP — redimensione e comprima mantendo a qualidade.", "tab-t-compress":"Comprimir",
"tname-t-unit":"Conversor de unidades", "tdesc-t-unit":"Comprimento, peso, temperatura, área, velocidade e dados — converta qualquer coisa na hora.", "tab-t-unit":"Unidades",
"tname-t-words":"Contador de palavras", "tdesc-t-words":"Palavras, caracteres, frases e tempo de leitura para redações, posts e artigos.", "tab-t-words":"Palavras",
"tname-t-quiz":"Quiz do criador", "tdesc-t-quiz":"Que tipo de criador você é? 8 perguntas divertidas — ganhe um cartão de resultado compartilhável.", "tab-t-quiz":"Quiz",
"tname-t-password":"Gerador de senhas", "tdesc-t-password":"Senhas fortes e aleatórias com um toque — escolha tamanho, símbolos e números. Copie na hora.", "tab-t-password":"Senha",
"tname-t-anagram":"Resolvedor de anagramas", "tdesc-t-anagram":"Digite letras — encontre todos os anagramas e palavras possíveis. Ótimo para Scrabble e palavras cruzadas.", "tab-t-anagram":"Anagramas",
"tname-t-qr":"Gerador de código QR", "tdesc-t-qr":"Transforme qualquer link ou texto em um QR escaneável — baixe o PNG, grátis.", "tab-t-qr":"QR",
"tname-t-myip":"Qual é meu IP", "tdesc-t-myip":"Veja seu endereço IP público com um toque — copie para formulários e configurações.", "tab-t-myip":"Meu IP",
foot_blog:"Blog", foot_about:"Sobre", foot_privacy:"Privacidade", foot_contact:"Contato", foot_terms:"Termos",
foot_tag:"Estúdio de IA gratuito e ferramentas online grátis. 21 ferramentas grátis: chat IA, imagens, vozes, vídeos narrativos, texto para vídeo, animador de fotos, legendas, cartões de citação, ferramentas PDF, compressor de imagens, calculadoras, conversor de unidades, contador de palavras, quiz, gerador de senhas, resolvedor de anagramas, gerador de QR e qual é meu IP.",
ip_localtime:"Seu horário local"
},
fr: {
nav_studio:"Studio", nav_blog:"Blog", nav_about:"À propos", nav_cta:"Commencer — Gratuit",
hero_t1:"Studio IA gratuit", hero_t2:"et outils en ligne gratuits",
hero_sub:"Créez des images IA, discutez avec l'IA, générez des voix, des vidéos narratives et plus — ainsi que des outils gratuits du quotidien : compresser, fusionner ou diviser des PDF, compresser des images, calculatrices d'âge, d'IMC et de mensualités, convertisseur d'unités, compteur de mots, un quiz amusant, générateur de mots de passe, solveur d'anagrammes, codes QR et quelle est mon IP. 21 outils gratuits, sans inscription. Choisissez un outil et lancez-vous — directement depuis votre navigateur.",
badge1:"✓ 100% GRATUIT", badge2:"✓ SANS INSCRIPTION", badge3:"✓ SANS CLÉ API",
hero_cta1:"Commencer — C'est gratuit", hero_cta2:"Apprendre →",
"tname-t-image":"Générateur d'images IA", "tdesc-t-image":"Transformez des mots en art. Photoréaliste, anime, 3D — tous styles, toutes tailles, gratuit.", "tab-t-image":"Image IA",
"tname-t-aichat":"Chat IA", "tdesc-t-aichat":"Posez n'importe quelle question — réponses instantanées de l'IA pour idées, devoirs, écriture et plus. Gratuit, sans inscription.", "tab-t-aichat":"Chat IA",
"tname-t-voice":"Générateur de voix IA", "tdesc-t-voice":"Synthèse vocale réaliste avec 8 voix — anglais, bengali et hindi. Téléchargez le MP3.", "tab-t-voice":"Voix IA",
"tname-t-story":"Créateur de vidéos narratives", "tdesc-t-story":"L'IA écrit votre histoire, génère les scènes, raconte et assemble une vidéo sous-titrée. Prête pour Shorts et Reels.", "tab-t-story":"Vidéo narrative",
"tname-t-rembg":"Suppression d'arrière-plan", "tdesc-t-rembg":"Importez n'importe quelle photo — obtenez un détourage net sur fond transparent, gratuit.", "tab-t-rembg":"Sans fond",
"tname-t-caption":"Générateur de légendes et hashtags", "tdesc-t-caption":"Légendes et hashtags rédigés par l'IA pour Reels, TikTok et YouTube Shorts. Copiez et publiez.", "tab-t-caption":"Légendes",
"tname-t-quote":"Créateur de citations et mèmes", "tdesc-t-quote":"Transformez n'importe quelle phrase en carte de citation 1080×1080. Quatre styles de dégradé.", "tab-t-quote":"Citations",
"tname-t-textvideo":"Texte vers vidéo", "tdesc-t-textvideo":"Décrivez une scène — l'IA génère l'image, nous ajoutons un mouvement fluide pour une vidéo de 5 secondes.", "tab-t-textvideo":"Texte→Vidéo",
"tname-t-animate":"Animateur de photos", "tdesc-t-animate":"Importez n'importe quelle photo — transformez-la en vidéo de 5 secondes avec zoom et panoramique cinématographiques.", "tab-t-animate":"Animateur",
"tname-t-age":"Calculateur d'âge", "tdesc-t-age":"Votre âge exact en années, mois et jours — plus le jour de la semaine de votre naissance et le compte à rebours de votre prochain anniversaire.", "tab-t-age":"Âge",
"tname-t-bmi":"Calculateur d'IMC", "tdesc-t-bmi":"Calculez votre indice de masse corporelle instantanément — catégorie, plage saine et signification.", "tab-t-bmi":"IMC",
"tname-t-emi":"Calculateur de mensualités", "tdesc-t-emi":"Mensualité, intérêts totaux et total à payer pour crédits immobilier, auto ou personnels.", "tab-t-emi":"Mensualités",
"tname-t-pdf":"Outils PDF", "tdesc-t-pdf":"Réduisez la taille des PDF, fusionnez-en plusieurs ou extrayez des pages — gratuit et privé.", "tab-t-pdf":"PDF",
"tname-t-compress":"Compresseur d'images", "tdesc-t-compress":"Réduisez vos photos JPG, PNG et WebP — redimensionnez et compressez en gardant la qualité.", "tab-t-compress":"Compresser",
"tname-t-unit":"Convertisseur d'unités", "tdesc-t-unit":"Longueur, poids, température, surface, vitesse et données — convertissez tout instantanément.", "tab-t-unit":"Unités",
"tname-t-words":"Compteur de mots", "tdesc-t-words":"Mots, caractères, phrases et temps de lecture pour dissertations, posts et articles.", "tab-t-words":"Mots",
"tname-t-quiz":"Quiz du créateur", "tdesc-t-quiz":"Quel type de créateur êtes-vous ? 8 questions amusantes — obtenez une carte de résultat à partager.", "tab-t-quiz":"Quiz",
"tname-t-password":"Générateur de mots de passe", "tdesc-t-password":"Des mots de passe forts et aléatoires en un geste — choisissez longueur, symboles et chiffres. Copie instantanée.", "tab-t-password":"Mot de passe",
"tname-t-anagram":"Solveur d'anagrammes", "tdesc-t-anagram":"Tapez des lettres — trouvez toutes les anagrammes et mots possibles. Idéal pour le Scrabble et les mots croisés.", "tab-t-anagram":"Anagrammes",
"tname-t-qr":"Générateur de codes QR", "tdesc-t-qr":"Transformez n'importe quel lien ou texte en QR scannable — téléchargez le PNG, gratuit.", "tab-t-qr":"QR",
"tname-t-myip":"Quelle est mon IP", "tdesc-t-myip":"Voyez votre adresse IP publique en un geste — copiez-la pour formulaires et configurations.", "tab-t-myip":"Mon IP",
foot_blog:"Blog", foot_about:"À propos", foot_privacy:"Confidentialité", foot_contact:"Contact", foot_terms:"Conditions",
foot_tag:"Studio IA gratuit et outils en ligne gratuits. 21 outils gratuits : chat IA, images, voix, vidéos narratives, texte vers vidéo, animateur de photos, légendes, cartes de citations, outils PDF, compresseur d'images, calculatrices, convertisseur d'unités, compteur de mots, quiz, générateur de mots de passe, solveur d'anagrammes, générateur QR et quelle est mon IP.",
ip_localtime:"Votre heure locale"
},
de: {
nav_studio:"Studio", nav_blog:"Blog", nav_about:"Über uns", nav_cta:"Jetzt erstellen — Kostenlos",
hero_t1:"Kostenloses KI-Studio", hero_t2:"& kostenlose Online-Tools",
hero_sub:"Erstelle KI-Bilder, chatte mit KI, generiere Stimmen, Story-Videos und mehr — plus kostenlose Alltags-Tools: PDFs komprimieren, zusammenführen oder teilen, Bilder komprimieren, Alters-, BMI- und Kreditrechner, Einheitenumrechner, Wortzähler, ein lustiges Quiz, Passwort-Generator, Anagramm-Löser, QR-Codes und wie ist meine IP. 21 kostenlose Tools — keine Anmeldung. Wähl ein Tool und leg los — direkt im Browser.",
badge1:"✓ 100% KOSTENLOS", badge2:"✓ KEINE ANMELDUNG", badge3:"✓ KEINE API-SCHLÜSSEL",
hero_cta1:"Jetzt erstellen — kostenlos", hero_cta2:"Anleitung →",
"tname-t-image":"KI-Bildgenerator", "tdesc-t-image":"Verwandle Wörter in Kunst. Fotorealistisch, Anime, 3D — jeder Stil, jede Größe, kostenlos.", "tab-t-image":"KI-Bild",
"tname-t-aichat":"KI-Chat", "tdesc-t-aichat":"Frag alles — sofortige KI-Antworten für Ideen, Hausaufgaben, Texte und mehr. Kostenlos, keine Anmeldung.", "tab-t-aichat":"KI-Chat",
"tname-t-voice":"KI-Stimmengenerator", "tdesc-t-voice":"Lebensechte Text-zu-Sprache mit 8 Stimmen — Englisch, Bengali und Hindi. MP3 herunterladen.", "tab-t-voice":"KI-Stimme",
"tname-t-story":"Story-Video-Macher", "tdesc-t-story":"Die KI schreibt deine Story, generiert Szenen, vertont und baut ein untertiteltes Video. Fertig für Shorts & Reels.", "tab-t-story":"Story-Video",
"tname-t-rembg":"Hintergrund-Entferner", "tdesc-t-rembg":"Lade ein Foto hoch — erhalte einen sauberen Ausschnitt mit transparentem Hintergrund, kostenlos.", "tab-t-rembg":"Hintergrund weg",
"tname-t-caption":"Caption- & Hashtag-Generator", "tdesc-t-caption":"KI-geschriebene Captions + Hashtags für Reels, TikTok & YouTube Shorts. Kopieren & posten.", "tab-t-caption":"Captions",
"tname-t-quote":"Zitat- / Meme-Macher", "tdesc-t-quote":"Verwandle jede Zeile in eine schöne 1080×1080 Zitat-Karte. Vier Farbverlauf-Stile.", "tab-t-quote":"Zitate",
"tname-t-textvideo":"Text zu Video", "tdesc-t-textvideo":"Beschreibe eine Szene — die KI generiert das Bild, wir fügen sanfte Bewegung für ein 5-Sekunden-Video hinzu.", "tab-t-textvideo":"Text→Video",
"tname-t-animate":"Foto-Animator", "tdesc-t-animate":"Lade ein Foto hoch — verwandle es in ein 5-Sekunden-Video mit kinoreifem Zoom & Schwenk.", "tab-t-animate":"Animator",
"tname-t-age":"Altersrechner", "tdesc-t-age":"Dein exaktes Alter in Jahren, Monaten & Tagen — plus Wochentag deiner Geburt & Countdown zum nächsten Geburtstag.", "tab-t-age":"Alter",
"tname-t-bmi":"BMI-Rechner", "tdesc-t-bmi":"Prüfe deinen Body-Mass-Index sofort — Kategorie, gesunder Bereich & was er bedeutet.", "tab-t-bmi":"BMI",
"tname-t-emi":"Kreditraten-Rechner", "tdesc-t-emi":"Monatliche Rate, Gesamtzinsen & Gesamtzahlung für Bau-, Auto- oder Privatkredite.", "tab-t-emi":"Raten",
"tname-t-pdf":"PDF-Tools", "tdesc-t-pdf":"PDF-Größe verkleinern, PDFs zusammenführen oder Seiten extrahieren — kostenlos, privat.", "tab-t-pdf":"PDF",
"tname-t-compress":"Bildkompressor", "tdesc-t-compress":"JPG-, PNG- & WebP-Fotos verkleinern — Größe ändern & komprimieren bei bester Qualität.", "tab-t-compress":"Komprimieren",
"tname-t-unit":"Einheitenumrechner", "tdesc-t-unit":"Länge, Gewicht, Temperatur, Fläche, Geschwindigkeit & Daten — alles sofort umrechnen.", "tab-t-unit":"Einheiten",
"tname-t-words":"Wortzähler", "tdesc-t-words":"Wörter, Zeichen, Sätze & Lesezeit für Aufsätze, Posts & Artikel.", "tab-t-words":"Wörter",
"tname-t-quiz":"Creator-Quiz", "tdesc-t-quiz":"Welcher Creator-Typ bist du? 8 lustige Fragen — erhalte eine teilbare Ergebnis-Karte.", "tab-t-quiz":"Quiz",
"tname-t-password":"Passwort-Generator", "tdesc-t-password":"Starke, zufällige Passwörter per Fingertipp — Länge, Symbole & Zahlen wählen. Sofort kopieren.", "tab-t-password":"Passwort",
"tname-t-anagram":"Anagramm-Löser", "tdesc-t-anagram":"Buchstaben eingeben — finde jedes Anagramm & Wort. Super für Scrabble & Rätsel.", "tab-t-anagram":"Anagramme",
"tname-t-qr":"QR-Code-Generator", "tdesc-t-qr":"Verwandle Links oder Text in einen scannbaren QR-Code — PNG herunterladen, kostenlos.", "tab-t-qr":"QR",
"tname-t-myip":"Wie ist meine IP", "tdesc-t-myip":"Deine öffentliche IP-Adresse per Fingertipp — für Formulare & Setups kopieren.", "tab-t-myip":"Meine IP",
foot_blog:"Blog", foot_about:"Über uns", foot_privacy:"Datenschutz", foot_contact:"Kontakt", foot_terms:"AGB",
foot_tag:"Kostenloses KI-Studio & kostenlose Online-Tools. 21 kostenlose Tools: KI-Chat, Bilder, Stimmen, Story-Videos, Text-zu-Video, Foto-Animator, Captions, Zitat-Karten, PDF-Tools, Bildkompressor, Rechner, Einheitenumrechner, Wortzähler, Quiz, Passwort-Generator, Anagramm-Löser, QR-Generator & wie ist meine IP. 100% kostenlos, keine Anmeldung.",
ip_localtime:"Deine lokale Zeit"
},
it: {
nav_studio:"Studio", nav_blog:"Blog", nav_about:"Chi siamo", nav_cta:"Inizia a creare — Gratis",
hero_t1:"Studio IA gratuito", hero_t2:"e strumenti online gratuiti",
hero_sub:"Crea immagini IA, chatta con l'IA, genera voci, story video e altro — più strumenti gratuiti per tutti i giorni: comprimi, unisci o dividi PDF, comprimi immagini, calcolatori di età, BMI e rate, convertitore di unità, contatore di parole, un quiz divertente, generatore di password, risolutore di anagrammi, codici QR e qual è il mio IP. 21 strumenti gratuiti, senza registrazione. Scegline uno e inizia — direttamente dal browser.",
badge1:"✓ 100% GRATIS", badge2:"✓ SENZA REGISTRAZIONE", badge3:"✓ SENZA CHIAVI API",
hero_cta1:"Inizia a creare — È gratis", hero_cta2:"Scopri come →",
"tname-t-image":"Generatore di immagini IA", "tdesc-t-image":"Trasforma le parole in arte. Fotorealistico, anime, 3D — ogni stile e dimensione, gratis.", "tab-t-image":"Immagine IA",
"tname-t-aichat":"Chat IA", "tdesc-t-aichat":"Chiedi qualsiasi cosa — risposte istantanee dell'IA per idee, compiti, scrittura e altro. Gratis, senza registrazione.", "tab-t-aichat":"Chat IA",
"tname-t-voice":"Generatore di voce IA", "tdesc-t-voice":"Sintesi vocale realistica con 8 voci — inglese, bengalese e hindi. Scarica l'MP3.", "tab-t-voice":"Voce IA",
"tname-t-story":"Creatore di story video", "tdesc-t-story":"L'IA scrive la tua storia, genera le scene, narra e assembla un video con sottotitoli. Pronto per Shorts e Reels.", "tab-t-story":"Story video",
"tname-t-rembg":"Rimozione sfondo", "tdesc-t-rembg":"Carica qualsiasi foto — ottieni un ritaglio pulito con sfondo trasparente, gratis.", "tab-t-rembg":"Rimuovi sfondo",
"tname-t-caption":"Generatore di didascalie e hashtag", "tdesc-t-caption":"Didascalie e hashtag scritti dall'IA per Reels, TikTok e YouTube Shorts. Copia e pubblica.", "tab-t-caption":"Didascalie",
"tname-t-quote":"Creatore di citazioni e meme", "tdesc-t-quote":"Trasforma qualsiasi frase in una bella card 1080×1080. Quattro stili di gradiente.", "tab-t-quote":"Citazioni",
"tname-t-textvideo":"Testo in video", "tdesc-t-textvideo":"Descrivi una scena — l'IA genera l'immagine e noi aggiungiamo un movimento fluido per un video di 5 secondi.", "tab-t-textvideo":"Testo→Video",
"tname-t-animate":"Animatore di foto", "tdesc-t-animate":"Carica qualsiasi foto — trasformala in un video di 5 secondi con zoom e panoramica cinematografici.", "tab-t-animate":"Animatore",
"tname-t-age":"Calcolatore di età", "tdesc-t-age":"La tua età esatta in anni, mesi e giorni — più il giorno della settimana di nascita e il conto alla rovescia per il prossimo compleanno.", "tab-t-age":"Età",
"tname-t-bmi":"Calcolatore BMI", "tdesc-t-bmi":"Controlla subito il tuo indice di massa corporea — categoria, intervallo sano e significato.", "tab-t-bmi":"BMI",
"tname-t-emi":"Calcolatore di rate", "tdesc-t-emi":"Rata mensile, interessi totali e totale dovuto per mutui, auto o prestiti personali.", "tab-t-emi":"Rate",
"tname-t-pdf":"Strumenti PDF", "tdesc-t-pdf":"Riduci le dimensioni dei PDF, uniscili in uno solo o estrai le pagine — gratis e privato.", "tab-t-pdf":"PDF",
"tname-t-compress":"Compressore di immagini", "tdesc-t-compress":"Riduci foto JPG, PNG e WebP — ridimensiona e comprimi mantenendo la qualità.", "tab-t-compress":"Comprimi",
"tname-t-unit":"Convertitore di unità", "tdesc-t-unit":"Lunghezza, peso, temperatura, area, velocità e dati — converti tutto all'istante.", "tab-t-unit":"Unità",
"tname-t-words":"Contatore di parole", "tdesc-t-words":"Parole, caratteri, frasi e tempo di lettura per temi, post e articoli.", "tab-t-words":"Parole",
"tname-t-quiz":"Quiz del creatore", "tdesc-t-quiz":"Che tipo di creatore sei? 8 domande divertenti — ottieni una card risultato da condividere.", "tab-t-quiz":"Quiz",
"tname-t-password":"Generatore di password", "tdesc-t-password":"Password forti e casuali con un tocco — scegli lunghezza, simboli e numeri. Copia istantanea.", "tab-t-password":"Password",
"tname-t-anagram":"Risolutore di anagrammi", "tdesc-t-anagram":"Digita delle lettere — trova ogni anagramma e parola possibile. Ottimo per Scarabeo ed enigmistica.", "tab-t-anagram":"Anagrammi",
"tname-t-qr":"Generatore di codici QR", "tdesc-t-qr":"Trasforma qualsiasi link o testo in un QR scansionabile — scarica il PNG, gratis.", "tab-t-qr":"QR",
"tname-t-myip":"Qual è il mio IP", "tdesc-t-myip":"Vedi il tuo indirizzo IP pubblico con un tocco — copialo per moduli e configurazioni.", "tab-t-myip":"Il mio IP",
foot_blog:"Blog", foot_about:"Chi siamo", foot_privacy:"Privacy", foot_contact:"Contatti", foot_terms:"Termini",
foot_tag:"Studio IA gratuito e strumenti online gratuiti. 21 strumenti gratuiti: chat IA, immagini, voci, story video, testo in video, animatore di foto, didascalie, card di citazioni, strumenti PDF, compressore di immagini, calcolatori, convertitore di unità, contatore di parole, quiz, generatore di password, risolutore di anagrammi, generatore QR e qual è il mio IP. 100% gratis, senza registrazione.",
ip_localtime:"La tua ora locale"
},
nl: {
nav_studio:"Studio", nav_blog:"Blog", nav_about:"Over ons", nav_cta:"Begin met maken — Gratis",
hero_t1:"Gratis AI-studio", hero_t2:"& gratis online tools",
hero_sub:"Maak AI-afbeeldingen, chat met AI, genereer stemmen, storyvideo's en meer — plus gratis dagelijkse tools: PDF's comprimeren, samenvoegen of splitsen, afbeeldingen comprimeren, leeftijds-, BMI- en leningcalculators, eenhedenomzetter, woordenteller, een leuke quiz, wachtwoordgenerator, anagramoplosser, QR-codes en wat is mijn IP. 21 gratis tools — geen registratie. Kies een tool en ga aan de slag — direct vanuit je browser.",
badge1:"✓ 100% GRATIS", badge2:"✓ GEEN REGISTRATIE", badge3:"✓ GEEN API-SLEUTELS",
hero_cta1:"Begin met maken — Het is gratis", hero_cta2:"Leer hoe →",
"tname-t-image":"AI-afbeeldinggenerator", "tdesc-t-image":"Verander woorden in kunst. Fotorealistisch, anime, 3D — elke stijl, elk formaat, gratis.", "tab-t-image":"AI-beeld",
"tname-t-aichat":"AI-chat", "tdesc-t-aichat":"Vraag alles — direct AI-antwoorden voor ideeën, huiswerk, schrijven en meer. Gratis, geen registratie.", "tab-t-aichat":"AI-chat",
"tname-t-voice":"AI-stemgenerator", "tdesc-t-voice":"Levensechte tekst-naar-spraak met 8 stemmen — Engels, Bengaals & Hindi. Download MP3.", "tab-t-voice":"AI-stem",
"tname-t-story":"Storyvideomaker", "tdesc-t-story":"AI schrijft je verhaal, genereert scènes, spreekt in en bouwt een video met ondertiteling. Klaar voor Shorts & Reels.", "tab-t-story":"Storyvideo",
"tname-t-rembg":"Achtergrondverwijderaar", "tdesc-t-rembg":"Upload een foto — krijg een nette uitsnede met transparante achtergrond, gratis.", "tab-t-rembg":"Achtergrond weg",
"tname-t-caption":"Caption- & hashtag-generator", "tdesc-t-caption":"AI-geschreven captions + hashtags voor Reels, TikTok & YouTube Shorts. Kopieer & post.", "tab-t-caption":"Captions",
"tname-t-quote":"Quote- / mememaker", "tdesc-t-quote":"Verander elke regel in een mooie 1080×1080 quote-kaart. Vier verloopstijlen.", "tab-t-quote":"Quotes",
"tname-t-textvideo":"Tekst naar video", "tdesc-t-textvideo":"Beschrijf een scène — AI genereert de afbeelding, wij voegen vloeiende beweging toe voor een video van 5 seconden.", "tab-t-textvideo":"Tekst→Video",
"tname-t-animate":"Foto-animator", "tdesc-t-animate":"Upload een foto — verander hem in een video van 5 seconden met cinematische zoom & pan.", "tab-t-animate":"Animator",
"tname-t-age":"Leeftijdscalculator", "tdesc-t-age":"Je exacte leeftijd in jaren, maanden & dagen — plus je geboorteweekdag & aftellen naar je volgende verjaardag.", "tab-t-age":"Leeftijd",
"tname-t-bmi":"BMI-calculator", "tdesc-t-bmi":"Check direct je Body Mass Index — categorie, gezond bereik & wat het betekent.", "tab-t-bmi":"BMI",
"tname-t-emi":"Leningscalculator", "tdesc-t-emi":"Maandbedrag, totale rente & totaal te betalen voor woon-, auto- of persoonlijke leningen.", "tab-t-emi":"Termijnen",
"tname-t-pdf":"PDF-tools", "tdesc-t-pdf":"Verklein PDF's, voeg PDF's samen of haal pagina's eruit — gratis, privé.", "tab-t-pdf":"PDF",
"tname-t-compress":"Afbeeldingscompresor", "tdesc-t-compress":"Verklein JPG-, PNG- & WebP-foto's — formaat wijzigen & comprimeren met behoud van kwaliteit.", "tab-t-compress":"Comprimeren",
"tname-t-unit":"Eenhedenomzetter", "tdesc-t-unit":"Lengte, gewicht, temperatuur, oppervlakte, snelheid & data — zet alles direct om.", "tab-t-unit":"Eenheden",
"tname-t-words":"Woordenteller", "tdesc-t-words":"Woorden, tekens, zinnen & leestijd voor essays, posts & artikelen.", "tab-t-words":"Woorden",
"tname-t-quiz":"Creator-quiz", "tdesc-t-quiz":"Wat voor creator ben jij? 8 leuke vragen — krijg een deelbare resultaatkaart.", "tab-t-quiz":"Quiz",
"tname-t-password":"Wachtwoordgenerator", "tdesc-t-password":"Sterke, willekeurige wachtwoorden met één tik — kies lengte, symbolen & cijfers. Direct kopiëren.", "tab-t-password":"Wachtwoord",
"tname-t-anagram":"Anagramoplosser", "tdesc-t-anagram":"Typ letters — vind elk anagram & woord dat je kunt maken. Geweldig voor Scrabble & puzzels.", "tab-t-anagram":"Anagrammen",
"tname-t-qr":"QR-codegenerator", "tdesc-t-qr":"Verander elke link of tekst in een scanbare QR-code — download de PNG, gratis.", "tab-t-qr":"QR",
"tname-t-myip":"Wat is mijn IP", "tdesc-t-myip":"Zie je openbare IP-adres met één tik — kopieer het voor formulieren & setups.", "tab-t-myip":"Mijn IP",
foot_blog:"Blog", foot_about:"Over ons", foot_privacy:"Privacy", foot_contact:"Contact", foot_terms:"Voorwaarden",
foot_tag:"Gratis AI-studio & gratis online tools. 21 gratis tools: AI-chat, afbeeldingen, stemmen, storyvideo's, tekst-naar-video, foto-animator, captions, quote-kaarten, PDF-tools, afbeeldingscompresor, calculators, eenhedenomzetter, woordenteller, quiz, wachtwoordgenerator, anagramoplosser, QR-generator en wat is mijn IP. 100% gratis, geen registratie.",
ip_localtime:"Jouw lokale tijd"
},
hi: {
nav_studio:"स्टूडियो", nav_blog:"ब्लॉग", nav_about:"हमारे बारे में", nav_cta:"बनाना शुरू करें — मुफ़्त",
hero_t1:"मुफ़्त AI स्टूडियो", hero_t2:"और मुफ़्त ऑनलाइन टूल्स",
hero_sub:"AI इमेज बनाएं, AI से चैट करें, आवाज़ें, स्टोरी वीडियो और बहुत कुछ — साथ ही रोज़मर्रा के मुफ़्त टूल्स: PDF कंप्रेस/मर्ज/स्प्लिट, इमेज कंप्रेस, उम्र/BMI/EMI कैलकुलेटर, यूनिट कन्वर्टर, वर्ड काउंटर, मज़ेदार क्विज़, पासवर्ड जनरेटर, एनाग्राम सॉल्वर, QR कोड और मेरा IP क्या है। 21 मुफ़्त टूल्स — बिना साइनअप। कोई टूल चुनें और शुरू करें — सीधे अपने ब्राउज़र से।",
badge1:"✓ 100% मुफ़्त", badge2:"✓ बिना साइनअप", badge3:"✓ बिना API की",
hero_cta1:"बनाना शुरू करें — बिल्कुल मुफ़्त", hero_cta2:"जानें कैसे →",
"tname-t-image":"AI इमेज जनरेटर", "tdesc-t-image":"शब्दों को कला में बदलें। फोटोरियलिस्टिक, एनीमे, 3D — कोई भी स्टाइल, कोई भी साइज़, मुफ़्त।", "tab-t-image":"AI इमेज",
"tname-t-aichat":"AI चैट", "tdesc-t-aichat":"कुछ भी पूछें — आइडिया, होमवर्क, लेखन और बहुत कुछ के लिए तुरंत AI जवाब। मुफ़्त, बिना साइनअप।", "tab-t-aichat":"AI चैट",
"tname-t-voice":"AI वॉइस जनरेटर", "tdesc-t-voice":"8 आवाज़ों में जीवंत टेक्स्ट-टू-स्पीच — अंग्रेज़ी, बंगाली और हिंदी। MP3 डाउनलोड करें।", "tab-t-voice":"AI वॉइस",
"tname-t-story":"स्टोरी वीडियो मेकर", "tdesc-t-story":"AI आपकी कहानी लिखता है, सीन बनाता है, नैरेशन करता है और कैप्शन वाला वीडियो तैयार करता है। Shorts और Reels के लिए तैयार।", "tab-t-story":"स्टोरी वीडियो",
"tname-t-rembg":"बैकग्राउंड रिमूवर", "tdesc-t-rembg":"कोई भी फोटो अपलोड करें — पारदर्शी बैकग्राउंड के साथ साफ़ कटआउट पाएं, मुफ़्त।", "tab-t-rembg":"बैकग्राउंड हटाएं",
"tname-t-caption":"कैप्शन और हैशटैग जनरेटर", "tdesc-t-caption":"Reels, TikTok और YouTube Shorts के लिए AI-लिखित कैप्शन + हैशटैग। कॉपी करें और पोस्ट करें।", "tab-t-caption":"कैप्शन",
"tname-t-quote":"कोट / मीम मेकर", "tdesc-t-quote":"किसी भी लाइन को सुंदर 1080×1080 कोट कार्ड में बदलें। चार ग्रेडिएंट स्टाइल।", "tab-t-quote":"कोट मेकर",
"tname-t-textvideo":"टेक्स्ट टू वीडियो", "tdesc-t-textvideo":"एक सीन बताएं — AI इमेज बनाएगा, हम 5 सेकंड के वीडियो के लिए स्मूद मोशन जोड़ेंगे।", "tab-t-textvideo":"टेक्स्ट→वीडियो",
"tname-t-animate":"फोटो एनिमेटर", "tdesc-t-animate":"कोई भी फोटो अपलोड करें — सिनेमैटिक ज़ूम और पैन के साथ 5 सेकंड के वीडियो में बदलें।", "tab-t-animate":"एनिमेटर",
"tname-t-age":"उम्र कैलकुलेटर", "tdesc-t-age":"साल, महीने और दिनों में आपकी सटीक उम्र — साथ ही जन्म का सप्ताहदिन और अगले जन्मदिन की उल्टी गिनती।", "tab-t-age":"उम्र",
"tname-t-bmi":"BMI कैलकुलेटर", "tdesc-t-bmi":"अपना बॉडी मास इंडेक्स तुरंत जांचें — कैटेगरी, स्वस्थ रेंज और इसका मतलब।", "tab-t-bmi":"BMI",
"tname-t-emi":"EMI कैलकुलेटर", "tdesc-t-emi":"होम, कार या पर्सनल लोन के लिए मासिक EMI, कुल ब्याज और कुल भुगतान।", "tab-t-emi":"EMI",
"tname-t-pdf":"PDF टूल्स", "tdesc-t-pdf":"PDF का साइज़ घटाएं, PDF मर्ज करें या पेज अलग करें — मुफ़्त, प्राइवेट।", "tab-t-pdf":"PDF टूल्स",
"tname-t-compress":"इमेज कंप्रेसर", "tdesc-t-compress":"JPG, PNG और WebP फोटो छोटी करें — क्वालिटी बनाए रखते हुए रीसाइज़ और कंप्रेस।", "tab-t-compress":"कंप्रेस",
"tname-t-unit":"यूनिट कन्वर्टर", "tdesc-t-unit":"लंबाई, वज़न, तापमान, क्षेत्रफल, गति और डेटा — कुछ भी तुरंत कन्वर्ट करें।", "tab-t-unit":"यूनिट",
"tname-t-words":"वर्ड काउंटर", "tdesc-t-words":"निबंध, पोस्ट और लेखों के लिए शब्द, अक्षर, वाक्य और पढ़ने का समय।", "tab-t-words":"शब्द",
"tname-t-quiz":"क्रिएटर क्विज़", "tdesc-t-quiz":"आप किस तरह के क्रिएटर हैं? 8 मज़ेदार सवाल — शेयर करने लायक रिज़ल्ट कार्ड पाएं।", "tab-t-quiz":"क्विज़",
"tname-t-password":"पासवर्ड जनरेटर", "tdesc-t-password":"एक टैप में मज़बूत, रैंडम पासवर्ड — लंबाई, सिंबल और नंबर चुनें। तुरंत कॉपी करें।", "tab-t-password":"पासवर्ड",
"tname-t-anagram":"एनाग्राम सॉल्वर", "tdesc-t-anagram":"अक्षर टाइप करें — हर एनाग्राम और बन सकने वाला शब्द खोजें। Scrabble और पहेलियों के लिए बढ़िया।", "tab-t-anagram":"एनाग्राम",
"tname-t-qr":"QR कोड जनरेटर", "tdesc-t-qr":"किसी भी लिंक या टेक्स्ट को स्कैन करने लायक QR कोड में बदलें — PNG डाउनलोड करें, मुफ़्त।", "tab-t-qr":"QR",
"tname-t-myip":"मेरा IP क्या है", "tdesc-t-myip":"एक टैप में अपना पब्लिक IP पता देखें — फॉर्म और सेटअप के लिए कॉपी करें।", "tab-t-myip":"मेरा IP",
foot_blog:"ब्लॉग", foot_about:"हमारे बारे में", foot_privacy:"प्राइवेसी", foot_contact:"संपर्क", foot_terms:"शर्तें",
foot_tag:"मुफ़्त AI स्टूडियो और मुफ़्त ऑनलाइन टूल्स। 21 मुफ़्त टूल्स: AI चैट, इमेज, आवाज़ें, स्टोरी वीडियो, टेक्स्ट-टू-वीडियो, फोटो एनिमेटर, कैप्शन, कोट कार्ड, PDF टूल्स, इमेज कंप्रेसर, कैलकुलेटर, यूनिट कन्वर्टर, वर्ड काउंटर, क्विज़, पासवर्ड जनरेटर, एनाग्राम सॉल्वर, QR जनरेटर और मेरा IP क्या है। 100% मुफ़्त, बिना साइनअप।",
ip_localtime:"आपका स्थानीय समय"
},
id: {
nav_studio:"Studio", nav_blog:"Blog", nav_about:"Tentang", nav_cta:"Mulai Membuat — Gratis",
hero_t1:"Studio AI gratis", hero_t2:"& alat online gratis",
hero_sub:"Buat gambar AI, ngobrol dengan AI, suara, video cerita & lainnya — plus alat gratis sehari-hari: kompres/gabung/pisah PDF, kompres gambar, kalkulator usia/BMI/cicilan, konverter satuan, penghitung kata, kuis seru, generator kata sandi, pemecah anagram, kode QR & berapa IP saya. 21 alat gratis — tanpa daftar. Pilih alat dan mulai — langsung dari browser.",
badge1:"✓ 100% GRATIS", badge2:"✓ TANPA DAFTAR", badge3:"✓ TANPA API KEY",
hero_cta1:"Mulai Membuat — Gratis", hero_cta2:"Pelajari caranya →",
"tname-t-image":"Generator Gambar AI", "tdesc-t-image":"Ubah kata menjadi seni. Fotorealistik, anime, 3D — gaya & ukuran apa pun, gratis.", "tab-t-image":"Gambar AI",
"tname-t-aichat":"Chat AI", "tdesc-t-aichat":"Tanya apa saja — jawaban AI instan untuk ide, PR, tulisan & lainnya. Gratis, tanpa daftar.", "tab-t-aichat":"Chat AI",
"tname-t-voice":"Generator Suara AI", "tdesc-t-voice":"Teks-ke-suara yang hidup dengan 8 suara — Inggris, Bengali & Hindi. Unduh MP3.", "tab-t-voice":"Suara AI",
"tname-t-story":"Pembuat Video Cerita", "tdesc-t-story":"AI menulis ceritamu, membuat adegan, menarasikan & merakit video berteks. Siap untuk Shorts & Reels.", "tab-t-story":"Video Cerita",
"tname-t-rembg":"Penghapus Latar", "tdesc-t-rembg":"Unggah foto apa pun — dapatkan potongan bersih dengan latar transparan, gratis.", "tab-t-rembg":"Hapus Latar",
"tname-t-caption":"Generator Caption & Hashtag", "tdesc-t-caption":"Caption + hashtag tulisan AI untuk Reels, TikTok & YouTube Shorts. Salin & posting.", "tab-t-caption":"Caption",
"tname-t-quote":"Pembuat Kutipan / Meme", "tdesc-t-quote":"Ubah baris apa pun menjadi kartu kutipan 1080×1080 yang indah. Empat gaya gradien.", "tab-t-quote":"Kutipan",
"tname-t-textvideo":"Teks ke Video", "tdesc-t-textvideo":"Jelaskan sebuah adegan — AI membuat gambarnya, kami tambah gerakan halus untuk video 5 detik.", "tab-t-textvideo":"Teks→Video",
"tname-t-animate":"Animator Foto", "tdesc-t-animate":"Unggah foto apa pun — ubah jadi video 5 detik dengan zoom & pan sinematik.", "tab-t-animate":"Animator",
"tname-t-age":"Kalkulator Usia", "tdesc-t-age":"Usiamu tepat dalam tahun, bulan & hari — plus hari lahirmu & hitung mundur ulang tahun berikutnya.", "tab-t-age":"Usia",
"tname-t-bmi":"Kalkulator BMI", "tdesc-t-bmi":"Cek Indeks Massa Tubuhmu seketika — kategori, rentang sehat & artinya.", "tab-t-bmi":"BMI",
"tname-t-emi":"Kalkulator Cicilan", "tdesc-t-emi":"Cicilan bulanan, total bunga & total bayar untuk pinjaman rumah, mobil atau pribadi.", "tab-t-emi":"Cicilan",
"tname-t-pdf":"Alat PDF", "tdesc-t-pdf":"Perkecil ukuran PDF, gabung PDF jadi satu, atau pisahkan halaman — gratis, privat.", "tab-t-pdf":"PDF",
"tname-t-compress":"Kompresor Gambar", "tdesc-t-compress":"Perkecil foto JPG, PNG & WebP — ubah ukuran & kompres dengan kualitas terjaga.", "tab-t-compress":"Kompres",
"tname-t-unit":"Konverter Satuan", "tdesc-t-unit":"Panjang, berat, suhu, luas, kecepatan & data — konversi apa pun seketika.", "tab-t-unit":"Satuan",
"tname-t-words":"Penghitung Kata", "tdesc-t-words":"Kata, karakter, kalimat & waktu baca untuk esai, postingan & artikel.", "tab-t-words":"Kata",
"tname-t-quiz":"Kuis Kreator", "tdesc-t-quiz":"Tipe kreator seperti apa kamu? 8 pertanyaan seru — dapatkan kartu hasil yang bisa dibagikan.", "tab-t-quiz":"Kuis",
"tname-t-password":"Generator Kata Sandi", "tdesc-t-password":"Kata sandi kuat & acak dalam satu ketuk — pilih panjang, simbol & angka. Salin seketika.", "tab-t-password":"Kata Sandi",
"tname-t-anagram":"Pemecah Anagram", "tdesc-t-anagram":"Ketik huruf — temukan semua anagram & kata yang bisa dibuat. Bagus untuk Scrabble & teka-teki.", "tab-t-anagram":"Anagram",
"tname-t-qr":"Generator Kode QR", "tdesc-t-qr":"Ubah tautan atau teks apa pun jadi kode QR yang bisa dipindai — unduh PNG-nya, gratis.", "tab-t-qr":"QR",
"tname-t-myip":"Berapa IP Saya", "tdesc-t-myip":"Lihat alamat IP publikmu dalam satu ketuk — salin untuk formulir & pengaturan.", "tab-t-myip":"IP Saya",
foot_blog:"Blog", foot_about:"Tentang", foot_privacy:"Privasi", foot_contact:"Kontak", foot_terms:"Syarat",
foot_tag:"Studio AI gratis & alat online gratis. 21 alat gratis: chat AI, gambar, suara, video cerita, teks-ke-video, animator foto, caption, kartu kutipan, alat PDF, kompresor gambar, kalkulator, konverter satuan, penghitung kata, kuis, generator kata sandi, pemecah anagram, generator QR & berapa IP saya. 100% gratis, tanpa daftar.",
ip_localtime:"Waktu lokalmu"
},
bn: {
nav_studio:"স্টুডিও", nav_blog:"ব্লগ", nav_about:"আমাদের সম্পর্কে", nav_cta:"বানানো শুরু করুন — ফ্রি",
hero_t1:"ফ্রি AI স্টুডিও", hero_t2:"ও ফ্রি অনলাইন টুলস",
hero_sub:"AI ছবি বানান, AI-এর সাথে চ্যাট করুন, ভয়েস, স্টোরি ভিডিও আরও অনেক কিছু — সাথে রোজকার ফ্রি টুলস: PDF কমপ্রেস/মার্জ/স্প্লিট, ছবি কমপ্রেস, বয়স/BMI/EMI ক্যালকুলেটর, ইউনিট কনভার্টার, ওয়ার্ড কাউন্টার, মজার কুইজ, পাসওয়ার্ড জেনারেটর, অ্যানাগ্রাম সলভার, QR কোড আর আমার IP কী। ২১টা ফ্রি টুল — সাইনআপ ছাড়াই। একটা টুল বেছে নিন আর শুরু করুন — সরাসরি আপনার ব্রাউজার থেকে।",
badge1:"✓ ১০০% ফ্রি", badge2:"✓ সাইনআপ লাগবে না", badge3:"✓ API কি লাগবে না",
hero_cta1:"বানানো শুরু করুন — একদম ফ্রি", hero_cta2:"জানুন কীভাবে →",
"tname-t-image":"AI ছবি জেনারেটর", "tdesc-t-image":"শব্দকে বানান শিল্প। ফটোরিয়ালিস্টিক, অ্যানিমে, 3D — যেকোনো স্টাইল, যেকোনো সাইজ, ফ্রি।", "tab-t-image":"AI ছবি",
"tname-t-aichat":"AI চ্যাট", "tdesc-t-aichat":"যা খুশি জিজ্ঞেস করুন — আইডিয়া, হোমওয়ার্ক, লেখালেখি আরও অনেক কিছুর জন্য তাৎক্ষণিক AI উত্তর। ফ্রি, সাইনআপ ছাড়াই।", "tab-t-aichat":"AI চ্যাট",
"tname-t-voice":"AI ভয়েস জেনারেটর", "tdesc-t-voice":"৮টি ভয়েসে প্রাণবন্ত টেক্সট-টু-স্পিচ — ইংরেজি, বাংলা ও হিন্দি। MP3 ডাউনলোড করুন।", "tab-t-voice":"AI ভয়েস",
"tname-t-story":"স্টোরি ভিডিও মেকার", "tdesc-t-story":"AI আপনার গল্প লিখবে, সিন বানাবে, বর্ণনা দেবে আর ক্যাপশনসহ ভিডিও তৈরি করবে। Shorts ও Reels-এর জন্য রেডি।", "tab-t-story":"স্টোরি ভিডিও",
"tname-t-rembg":"ব্যাকগ্রাউন্ড রিমুভার", "tdesc-t-rembg":"যেকোনো ছবি আপলোড করুন — স্বচ্ছ ব্যাকগ্রাউন্ডসহ পরিষ্কার কাটআউট পান, ফ্রি।", "tab-t-rembg":"ব্যাকগ্রাউন্ড মুছুন",
"tname-t-caption":"ক্যাপশন ও হ্যাশট্যাগ জেনারেটর", "tdesc-t-caption":"Reels, TikTok ও YouTube Shorts-এর জন্য AI-লেখা ক্যাপশন + হ্যাশট্যাগ। কপি করুন ও পোস্ট করুন।", "tab-t-caption":"ক্যাপশন",
"tname-t-quote":"কোট / মিম মেকার", "tdesc-t-quote":"যেকোনো লাইনকে বানান সুন্দর 1080×1080 কোট কার্ড। চারটি গ্রেডিয়েন্ট স্টাইল।", "tab-t-quote":"কোট মেকার",
"tname-t-textvideo":"টেক্সট টু ভিডিও", "tdesc-t-textvideo":"একটা দৃশ্য বর্ণনা করুন — AI ছবি বানাবে, আমরা ৫ সেকেন্ডের ভিডিওর জন্য মসৃণ মোশন যোগ করব।", "tab-t-textvideo":"টেক্সট→ভিডিও",
"tname-t-animate":"ফটো অ্যানিমেটর", "tdesc-t-animate":"যেকোনো ছবি আপলোড করুন — সিনেমাটিক জুম ও প্যানসহ ৫ সেকেন্ডের ভিডিওতে বদলে ফেলুন।", "tab-t-animate":"অ্যানিমেটর",
"tname-t-age":"বয়স ক্যালকুলেটর", "tdesc-t-age":"বছর, মাস ও দিনে আপনার সঠিক বয়স — সাথে জন্মের সপ্তাহদিন ও পরের জন্মদিনের কাউন্টডাউন।", "tab-t-age":"বয়স",
"tname-t-bmi":"BMI ক্যালকুলেটর", "tdesc-t-bmi":"আপনার বডি মাস ইনডেক্স সাথে সাথে দেখুন — ক্যাটাগরি, স্বাস্থ্যকর রেঞ্জ ও এর মানে।", "tab-t-bmi":"BMI",
"tname-t-emi":"EMI ক্যালকুলেটর", "tdesc-t-emi":"বাড়ি, গাড়ি বা পার্সোনাল লোনের মাসিক EMI, মোট সুদ ও মোট পরিশোধ।", "tab-t-emi":"EMI",
"tname-t-pdf":"PDF টুলস", "tdesc-t-pdf":"PDF-এর সাইজ কমান, PDF একসাথে জোড়া দিন বা পেজ আলাদা করুন — ফ্রি, প্রাইভেট।", "tab-t-pdf":"PDF টুলস",
"tname-t-compress":"ছবি কমপ্রেসর", "tdesc-t-compress":"JPG, PNG ও WebP ছবি ছোট করুন — কোয়ালিটি ধরে রেখে রিসাইজ ও কমপ্রেস।", "tab-t-compress":"কমপ্রেস",
"tname-t-unit":"ইউনিট কনভার্টার", "tdesc-t-unit":"দৈর্ঘ্য, ওজন, তাপমাত্রা, ক্ষেত্রফল, গতি ও ডেটা — যেকোনো কিছু সাথে সাথে কনভার্ট।", "tab-t-unit":"ইউনিট",
"tname-t-words":"ওয়ার্ড কাউন্টার", "tdesc-t-words":"রচনা, পোস্ট ও আর্টিকেলের জন্য শব্দ, অক্ষর, বাক্য ও পড়ার সময়।", "tab-t-words":"শব্দ",
"tname-t-quiz":"ক্রিয়েটর কুইজ", "tdesc-t-quiz":"আপনি কোন ধরনের ক্রিয়েটর? ৮টা মজার প্রশ্ন — শেয়ার করার মতো রেজাল্ট কার্ড পান।", "tab-t-quiz":"কুইজ",
"tname-t-password":"পাসওয়ার্ড জেনারেটর", "tdesc-t-password":"এক ট্যাপে শক্তিশালী, র‍্যান্ডম পাসওয়ার্ড — দৈর্ঘ্য, চিহ্ন ও সংখ্যা বেছে নিন। সাথে সাথে কপি।", "tab-t-password":"পাসওয়ার্ড",
"tname-t-anagram":"অ্যানাগ্রাম সলভার", "tdesc-t-anagram":"অক্ষর লিখুন — সব অ্যানাগ্রাম ও বানানো যায় এমন শব্দ খুঁজুন। Scrabble ও ধাঁধার জন্য দারুণ।", "tab-t-anagram":"অ্যানাগ্রাম",
"tname-t-qr":"QR কোড জেনারেটর", "tdesc-t-qr":"যেকোনো লিংক বা টেক্সটকে স্ক্যানযোগ্য QR কোডে বদলান — PNG ডাউনলোড করুন, ফ্রি।", "tab-t-qr":"QR",
"tname-t-myip":"আমার IP কী", "tdesc-t-myip":"এক ট্যাপে আপনার পাবলিক IP ঠিকানা দেখুন — ফর্ম ও সেটআপের জন্য কপি করুন।", "tab-t-myip":"আমার IP",
foot_blog:"ব্লগ", foot_about:"আমাদের সম্পর্কে", foot_privacy:"প্রাইভেসি", foot_contact:"যোগাযোগ", foot_terms:"শর্তাবলী",
foot_tag:"ফ্রি AI স্টুডিও ও ফ্রি অনলাইন টুলস। ২১টা ফ্রি টুল: AI চ্যাট, ছবি, ভয়েস, স্টোরি ভিডিও, টেক্সট-টু-ভিডিও, ফটো অ্যানিমেটর, ক্যাপশন, কোট কার্ড, PDF টুলস, ছবি কমপ্রেসর, ক্যালকুলেটর, ইউনিট কনভার্টার, ওয়ার্ড কাউন্টার, কুইজ, পাসওয়ার্ড জেনারেটর, অ্যানাগ্রাম সলভার, QR জেনারেটর ও আমার IP কী। ১০০% ফ্রি, সাইনআপ ছাড়াই।",
ip_localtime:"আপনার স্থানীয় সময়"
},
tr: {
nav_studio:"Stüdyo", nav_blog:"Blog", nav_about:"Hakkında", nav_cta:"Oluşturmaya başla — Ücretsiz",
hero_t1:"Ücretsiz YZ Stüdyosu", hero_t2:"ve ücretsiz çevrimiçi araçlar",
hero_sub:"YZ görselleri oluşturun, YZ ile sohbet edin, sesler, hikaye videoları ve daha fazlası — ayrıca günlük ücretsiz araçlar: PDF sıkıştırma/birleştirme/ayırma, görsel sıkıştırma, yaş/BMI/kredi hesaplayıcılar, birim dönüştürücü, kelime sayacı, eğlenceli test, şifre oluşturucu, anagram çözücü, QR kodlar ve IP adresim ne. 21 ücretsiz araç — kayıt yok. Bir araç seçin ve başlayın — doğrudan tarayıcınızdan.",
badge1:"✓ %100 ÜCRETSİZ", badge2:"✓ KAYIT YOK", badge3:"✓ API ANAHTARI YOK",
hero_cta1:"Oluşturmaya başla — Tamamen ücretsiz", hero_cta2:"Nasıl yapılır →",
"tname-t-image":"YZ Görsel Oluşturucu", "tdesc-t-image":"Kelimeleri sanata dönüştürün. Fotogerçekçi, anime, 3D — her stil, her boyut, ücretsiz.", "tab-t-image":"YZ Görsel",
"tname-t-aichat":"YZ Sohbet", "tdesc-t-aichat":"Her şeyi sorun — fikirler, ödevler, yazılar ve daha fazlası için anında YZ yanıtları. Ücretsiz, kayıt yok.", "tab-t-aichat":"YZ Sohbet",
"tname-t-voice":"YZ Ses Oluşturucu", "tdesc-t-voice":"8 sesle gerçekçi metinden konuşmaya — İngilizce, Bengalce ve Hintçe. MP3 indirin.", "tab-t-voice":"YZ Ses",
"tname-t-story":"Hikaye Video Yapıcı", "tdesc-t-story":"YZ hikayenizi yazar, sahneleri oluşturur, seslendirir ve altyazılı videoyu hazırlar. Shorts ve Reels için hazır.", "tab-t-story":"Hikaye Video",
"tname-t-rembg":"Arka Plan Silici", "tdesc-t-rembg":"Herhangi bir fotoğraf yükleyin — şeffaf arka planlı temiz kesit alın, ücretsiz.", "tab-t-rembg":"Arka Plan Sil",
"tname-t-caption":"Altyazı ve Hashtag Oluşturucu", "tdesc-t-caption":"Reels, TikTok ve YouTube Shorts için YZ yazılı altyazılar + hashtagler. Kopyalayın ve paylaşın.", "tab-t-caption":"Altyazı",
"tname-t-quote":"Alıntı / Meme Yapıcı", "tdesc-t-quote":"Her satırı güzel bir 1080×1080 alıntı kartına dönüştürün. Dört degrade stili.", "tab-t-quote":"Alıntı",
"tname-t-textvideo":"Metinden Video", "tdesc-t-textvideo":"Bir sahne anlatın — YZ görseli oluşturur, 5 saniyelik video için akıcı hareket ekleriz.", "tab-t-textvideo":"Metin→Video",
"tname-t-animate":"Fotoğraf Animatörü", "tdesc-t-animate":"Herhangi bir fotoğraf yükleyin — sinematik zoom ve kaydırma ile 5 saniyelik videoya dönüştürün.", "tab-t-animate":"Animatör",
"tname-t-age":"Yaş Hesaplayıcı", "tdesc-t-age":"Yıl, ay ve gün olarak tam yaşınız — artı doğum gününüz ve sonraki doğum gününe geri sayım.", "tab-t-age":"Yaş",
"tname-t-bmi":"BMI Hesaplayıcı", "tdesc-t-bmi":"Vücut kitle indeksinizi anında öğrenin — kategori, sağlıklı aralık ve anlamı.", "tab-t-bmi":"BMI",
"tname-t-emi":"Kredi Hesaplayıcı", "tdesc-t-emi":"Konut, taşıt veya ihtiyaç kredileri için aylık taksit, toplam faiz ve toplam ödeme.", "tab-t-emi":"Taksit",
"tname-t-pdf":"PDF Araçları", "tdesc-t-pdf":"PDF boyutunu küçültün, PDF'leri birleştirin veya sayfaları ayırın — ücretsiz, gizli.", "tab-t-pdf":"PDF",
"tname-t-compress":"Görsel Sıkıştırıcı", "tdesc-t-compress":"JPG, PNG ve WebP fotoğrafları küçültün — kaliteyi koruyarak yeniden boyutlandırın ve sıkıştırın.", "tab-t-compress":"Sıkıştır",
"tname-t-unit":"Birim Dönüştürücü", "tdesc-t-unit":"Uzunluk, ağırlık, sıcaklık, alan, hız ve veri — anında dönüştürün.", "tab-t-unit":"Birim",
"tname-t-words":"Kelime Sayacı", "tdesc-t-words":"Denemeler ve gönderiler için kelime, karakter, cümle ve okuma süresi.", "tab-t-words":"Kelime",
"tname-t-quiz":"İçerik Üretici Testi", "tdesc-t-quiz":"Ne tür bir içerik üreticisiniz? 8 eğlenceli soru — paylaşılabilir sonuç kartı alın.", "tab-t-quiz":"Test",
"tname-t-password":"Şifre Oluşturucu", "tdesc-t-password":"Tek dokunuşla güçlü rastgele şifreler — uzunluk, sembol ve rakam seçin. Anında kopyalayın.", "tab-t-password":"Şifre",
"tname-t-anagram":"Anagram Çözücü", "tdesc-t-anagram":"Harf yazın — tüm anagramları ve kurulabilecek kelimeleri bulun. Scrabble ve bulmacalar için ideal.", "tab-t-anagram":"Anagram",
"tname-t-qr":"QR Kod Oluşturucu", "tdesc-t-qr":"Herhangi bir bağlantıyı veya metni taranabilir QR koda dönüştürün — PNG indirin, ücretsiz.", "tab-t-qr":"QR",
"tname-t-myip":"IP Adresim Ne", "tdesc-t-myip":"Genel IP adresinizi tek dokunuşla görün — formlar ve kurulumlar için kopyalayın.", "tab-t-myip":"IP'm",
foot_blog:"Blog", foot_about:"Hakkında", foot_privacy:"Gizlilik", foot_contact:"İletişim", foot_terms:"Şartlar",
foot_tag:"Ücretsiz YZ stüdyosu ve ücretsiz çevrimiçi araçlar. 21 ücretsiz araç: YZ sohbet, görseller, sesler, hikaye videoları, metinden video, fotoğraf animatörü, altyazılar, alıntı kartları, PDF araçları, görsel sıkıştırıcı, hesaplayıcılar, birim dönüştürücü, kelime sayacı, test, şifre oluşturucu, anagram çözücü, QR kod oluşturucu ve IP adresim ne. 100% ücretsiz, kayıt yok.",
ip_localtime:"Yerel saatiniz"
}
};

/* ---- core: detect, apply, clock, timezone ---- */
(function(){
  function ffDetectLang(){
    try{
      var saved = null;
      try{ saved = localStorage.getItem('ff_lang'); }catch(e){}
      if(saved && FF_LANGS.indexOf(saved) >= 0) return saved;
    }catch(e){}
    var n = '';
    try{ n = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en'); }catch(e){ n = 'en'; }
    n = String(n).toLowerCase().split('-')[0].split('_')[0];
    return FF_LANGS.indexOf(n) >= 0 ? n : 'en';
  }
  function applyLang(l){
    if(FF_LANGS.indexOf(l) < 0) l = 'en';
    var d = I18N[l] || {};
    var els = document.querySelectorAll('[data-i18n]');
    for(var i=0;i<els.length;i++){
      var k = els[i].getAttribute('data-i18n');
      if(d[k]) els[i].textContent = d[k];
    }
    try{ document.documentElement.lang = l; }catch(e){}
    var sel = document.getElementById('ff-lang');
    if(sel && sel.value !== l) sel.value = l;
    try{ localStorage.setItem('ff_lang', l); }catch(e){}
  }
  function initLangUI(){
    var sel = document.getElementById('ff-lang');
    if(!sel) return;
    if(!sel.options.length){
      for(var i=0;i<FF_LANGS.length;i++){
        var o = document.createElement('option');
        o.value = FF_LANGS[i];
        o.textContent = FF_LANG_NAMES[FF_LANGS[i]] || FF_LANGS[i];
        sel.appendChild(o);
      }
    }
    sel.addEventListener('change', function(e){ applyLang(e.target.value); });
    applyLang(ffDetectLang());
  }
  function ffTimezone(){
    try{ return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }catch(e){ return ''; }
  }
  function tickClock(){
    var el = document.getElementById('ff-clock');
    if(!el) return;
    try{
      var s = new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());
      el.textContent = s;
      var tz = ffTimezone();
      if(tz) el.title = tz;
    }catch(e){}
  }
  function showIpLocalTime(){
    var box = document.getElementById('ip-tz');
    if(!box) return;
    try{
      var tz = ffTimezone();
      var s = new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date());
      var label = 'Your local time';
      try{
        var l = document.documentElement.lang || 'en';
        if(I18N[l] && I18N[l].ip_localtime) label = I18N[l].ip_localtime;
      }catch(e){}
      box.textContent = '🕐 ' + label + ': ' + s + (tz ? ' (' + tz + ')' : '');
    }catch(e){}
  }
  function hookMyIp(){
    var btn = document.getElementById('ip-go');
    if(!btn) return;
    var orig = btn.onclick;
    btn.onclick = function(e){
      var r = orig ? orig.call(this, e) : null;
      if(r && typeof r.then === 'function'){ r.then(function(){ showIpLocalTime(); }); }
      else { setTimeout(showIpLocalTime, 50); }
      return r;
    };
  }
  function init(){
    initLangUI();
    tickClock();
    try{ setInterval(tickClock, 1000); }catch(e){}
    hookMyIp();
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
  window.FF_applyLang = applyLang;
})();
