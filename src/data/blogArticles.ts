export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  publishedLabel: string;
  category: 'partnerships';
  readingTime: string;
  paragraphs: string[];
  signature: string;
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'pepek-faf-parceria-mobilidade-aliou-cisse',
    title: 'PEPEK Grupo Rent a Car e FAF oficializam parceria estratégica de mobilidade com entrega de viatura ao seleccionador nacional Aliou Cissé',
    excerpt: 'A PEPEK Grupo Rent a Car e a Federação Angolana de Futebol oficializaram uma parceria estratégica de mobilidade, assinalada pela entrega de uma viatura ao seleccionador nacional de Angola, Aliou Cissé.',
    image: '/blog/pepek-faf-aliou-cisse.png',
    imageAlt: 'Aliou Cissé e um representante da PEPEK durante a cerimónia de oficialização da parceria entre a PEPEK Grupo Rent a Car e a FAF',
    publishedAt: '2026-10-09',
    publishedLabel: '09 de Outubro de 2026',
    category: 'partnerships',
    readingTime: '4 min',
    paragraphs: [
      'A PEPEK Grupo Rent a Car e a Federação Angolana de Futebol (FAF) oficializaram uma parceria estratégica de mobilidade, assinalada pela entrega de uma viatura ao seleccionador nacional de futebol de Angola, Aliou Cissé. A cerimónia reuniu representantes das duas instituições, distintas figuras do desporto nacional, convidados e profissionais da comunicação social, num momento que reforça a ligação entre o sector empresarial e o futebol angolano.',
      'O acto representou um passo significativo na colaboração entre a PEPEK e a FAF, evidenciando o papel da mobilidade no apoio aos protagonistas e às instituições que contribuem para o desenvolvimento do desporto nacional.',
      'Conduzida por Diana Mingas, apresentadora da TV Zimbo, a cerimónia contou com a presença de Alves Simões, presidente da Federação Angolana de Futebol, do Eng.º Pedro Kilombo, CEO da PEPEK Grupo Rent a Car, e de outras personalidades e representantes institucionais.',
      'Em representação da PEPEK, a Chief Commercial Officer (CCO), Dra. Elizet Kilombo, proferiu o discurso institucional da marca, destacando a importância desta parceria e o compromisso da organização com iniciativas que promovam o futebol angolano.',
      'A sua intervenção reforçou a visão da PEPEK de que a mobilidade vai além do transporte, constituindo um elemento fundamental para proporcionar condições de acompanhamento, conforto e eficiência aos profissionais que representam Angola em diferentes contextos.',
      'Um dos momentos centrais da cerimónia foi a entrega de uma viatura ao seleccionador nacional, Aliou Cissé, simbolizando a concretização do compromisso de mobilidade estabelecido entre a PEPEK e a FAF.',
      'A iniciativa enquadra-se no posicionamento da PEPEK Grupo Rent a Car enquanto marca dedicada a soluções de mobilidade, com foco na qualidade do serviço, na confiança e na excelência da experiência proporcionada aos seus clientes e parceiros.',
      'Ao associar-se à Federação Angolana de Futebol, a PEPEK reforça a sua proximidade com uma das instituições de maior relevância no panorama desportivo nacional e com os projectos que mobilizam os angolanos em torno dos Palancas Negras.',
      'A formalização desta parceria representa uma oportunidade para fortalecer a cooperação entre o sector privado e o desporto, valorizando iniciativas que contribuam para o acompanhamento dos desafios da selecção nacional.',
      'Para a PEPEK, esta colaboração está alinhada com uma visão de crescimento que procura estabelecer relações institucionais consistentes e participar em iniciativas de relevância para Angola, colocando a mobilidade ao serviço de pessoas, organizações e projectos.',
      'O momento assinala, assim, o início de uma nova etapa de colaboração entre a PEPEK Grupo Rent a Car e a FAF, sustentada pela ambição de acompanhar o futebol angolano no seu percurso e nos desafios que se seguem.',
    ],
    signature: 'PEPEK Grupo Rent a Car — Experiência premium em cada quilómetro.',
  },
];

export const getBlogArticle = (slug: string | undefined) => BLOG_ARTICLES.find((article) => article.slug === slug);
