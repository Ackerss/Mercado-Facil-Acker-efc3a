// categoryEngine.js — Identifica categorias automaticamente por palavras-chave

const CATEGORIES = [
  {
    id: 'limpeza',
    label: 'Limpeza',
    emoji: '🧹',
    colorClass: 'category-limpeza',
    glowColor: 'rgba(59,130,246,0.35)',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-700',
    keywords: [
      'detergente', 'sabão', 'sabao', 'desinfetante', 'água sanitária', 'agua sanitaria',
      'multiuso', 'limpador', 'esponja', 'vassoura', 'rodo', 'pano', 'flanela',
      'cloro', 'amaciante', 'alvejante', 'tira manchas', 'lava louça', 'lava roupa',
      'ajax', 'veja', 'omo', 'ariel', 'downy', 'comfort', 'pinho', 'flash',
      'brilhante', 'bombar', 'lysol', 'fabuloso', 'sapolio', 'ypê', 'ype',
      'papel toalha', 'guardanapo', 'saco de lixo', 'lixo', 'reto',
    ],
  },
  {
    id: 'hortifruti',
    label: 'Hortifruti',
    emoji: '🥬',
    colorClass: 'category-hortifruti',
    glowColor: 'rgba(132,204,22,0.35)',
    bgClass: 'bg-lime-50',
    borderClass: 'border-lime-200',
    textClass: 'text-lime-700',
    keywords: [
      'alface', 'tomate', 'cebola', 'alho', 'batata', 'cenoura', 'abobrinha',
      'pimentão', 'pimentao', 'beterraba', 'brócolis', 'brocolis', 'couve',
      'espinafre', 'salsa', 'cheiro-verde', 'cheiro verde', 'hortelã', 'hortelã',
      'banana', 'maçã', 'maca', 'laranja', 'limão', 'limao', 'mamão', 'mamao',
      'abacaxi', 'manga', 'uva', 'pera', 'melancia', 'melão', 'melao',
      'morango', 'kiwi', 'abacate', 'coco', 'açaí', 'acai', 'fruta', 'legume',
      'verdura', 'tempero', 'erva', 'aipim', 'mandioca', 'inhame',
    ],
  },
  {
    id: 'carnes',
    label: 'Carnes',
    emoji: '🥩',
    colorClass: 'category-carnes',
    glowColor: 'rgba(239,68,68,0.3)',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
    textClass: 'text-red-700',
    keywords: [
      'carne', 'frango', 'peixe', 'linguiça', 'linguica', 'salsicha', 'bacon',
      'presunto', 'mortadela', 'peito', 'coxa', 'sobrecoxa', 'file', 'filé',
      'alcatra', 'picanha', 'contrafilé', 'contrafile', 'costela', 'bisteca',
      'patinho', 'acém', 'acem', 'músculo', 'musculo', 'maminha', 'paleta',
      'calabresa', 'defumado', 'atum', 'sardinha', 'camarão', 'camarao',
      'lagosta', 'tilapia', 'tilápia', 'salmão', 'salmao', 'coxinha', 'kafta',
      'hamburguer', 'hambúrguer', 'nuggets', 'chester', 'peru',
    ],
  },
  {
    id: 'laticinios',
    label: 'Laticínios',
    emoji: '🥛',
    colorClass: 'category-laticinios',
    glowColor: 'rgba(251,191,36,0.3)',
    bgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-200',
    textClass: 'text-yellow-700',
    keywords: [
      'leite', 'queijo', 'iogurte', 'manteiga', 'requeijão', 'requeijao',
      'creme de leite', 'nata', 'ninho', 'molico', 'longa vida',
      'muçarela', 'mucurela', 'mussarela', 'prato', 'minas', 'cottage',
      'provolone', 'parmesão', 'parmesao', 'ricota', 'cream cheese',
      'achocolatado', 'toddynho', 'toddy', 'nescau',
    ],
  },
  {
    id: 'bebidas',
    label: 'Bebidas',
    emoji: '🥤',
    colorClass: 'category-bebidas',
    glowColor: 'rgba(139,92,246,0.35)',
    bgClass: 'bg-violet-50',
    borderClass: 'border-violet-200',
    textClass: 'text-violet-700',
    keywords: [
      'água', 'agua', 'suco', 'refrigerante', 'cerveja', 'vinho', 'whisky',
      'vodka', 'coca', 'pepsi', 'fanta', 'sprite', 'guaraná', 'guarana',
      'energético', 'energetico', 'red bull', 'monster', 'isotônico', 'isotonico',
      'chá', 'cha', 'café', 'cafe', 'nescafé', 'nescafe', 'capuccino',
      'suco de', 'néctar', 'nectar', 'del valle', 'natureza', 'toddy',
    ],
  },
  {
    id: 'higiene',
    label: 'Higiene',
    emoji: '🧴',
    colorClass: 'category-higiene',
    glowColor: 'rgba(244,114,182,0.3)',
    bgClass: 'bg-pink-50',
    borderClass: 'border-pink-200',
    textClass: 'text-pink-700',
    keywords: [
      'shampoo', 'condicionador', 'sabonete', 'creme', 'hidratante', 'protetor',
      'desodorante', 'perfume', 'escova', 'pasta de dente', 'creme dental',
      'fio dental', 'papel higiênico', 'papel higienico', 'absorvente',
      'cotonete', 'algodão', 'algodao', 'gilete', 'barbeador', 'navalha',
      'aparelho de barbear', 'pomada', 'band aid', 'curativo', 'esmalte',
      'acetona', 'remove', 'loção', 'locao', 'dove', 'nívea', 'nivea',
      'seda', 'pantene', 'clear', 'head', 'oral b', 'colgate', 'sensodyne',
    ],
  },
  {
    id: 'padaria',
    label: 'Padaria',
    emoji: '🍞',
    colorClass: 'category-padaria',
    glowColor: 'rgba(249,115,22,0.3)',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-200',
    textClass: 'text-orange-700',
    keywords: [
      'pão', 'pao', 'bolo', 'biscoito', 'bolacha', 'torrada', 'croissant',
      'rosca', 'panetone', 'cuca', 'broa', 'bisnaguinha', 'baguete',
      'pãozinho', 'paozinho', 'integral', 'aveia', 'granola', 'cereal',
      'farinha', 'fermento', 'chocolate', 'achocolatado', 'wafer', 'cookie',
      'cream cracker', 'água e sal', 'maisena', 'polvilho',
    ],
  },
];

const DEFAULT_CATEGORY = {
  id: 'outros',
  label: 'Outros',
  emoji: '🛒',
  colorClass: 'category-outros',
  glowColor: 'rgba(100,116,139,0.2)',
  bgClass: 'bg-slate-50',
  borderClass: 'border-slate-200',
  textClass: 'text-slate-700',
};

/**
 * Detecta a categoria de um item pelo texto.
 * @param {string} text - O texto do item
 * @returns {object} Objeto de categoria com label, emoji, cores, etc.
 */
export function detectCategory(text) {
  if (!text) return DEFAULT_CATEGORY;
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const category of CATEGORIES) {
    for (const keyword of category.keywords) {
      const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lower.includes(normalizedKeyword)) {
        return category;
      }
    }
  }
  return DEFAULT_CATEGORY;
}

export { CATEGORIES, DEFAULT_CATEGORY };
