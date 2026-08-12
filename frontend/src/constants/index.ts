export const fakerCategories = [
  {
    category: 'Name',
    items: [
      { variable: '{{name.firstName}}', example: 'Alice' },
      { variable: '{{name.lastName}}', example: 'Smith' },
      { variable: '{{name.fullName}}', example: 'Alice Smith' },
      { variable: '{{name.title}}', example: 'Software Engineer' },
    ],
  },
  {
    category: 'Internet',
    items: [
      { variable: '{{internet.email}}', example: 'alice@example.com' },
      { variable: '{{internet.username}}', example: 'alice_smith99' },
      { variable: '{{internet.password}}', example: 'aBc!23XYZ' },
      { variable: '{{internet.url}}', example: 'https://example.com' },
      {
        variable: '{{internet.uuid}}',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
    ],
  },
  {
    category: 'Address',
    items: [
      { variable: '{{address.city}}', example: 'San Francisco' },
      { variable: '{{address.streetAddress}}', example: '123 Main St' },
      { variable: '{{address.country}}', example: 'United States' },
      { variable: '{{address.zipCode}}', example: '94105' },
    ],
  },
  {
    category: 'Lorem (Placeholder Text)',
    items: [
      { variable: '{{lorem.word}}', example: 'voluptatem' },
      {
        variable: '{{lorem.sentence}}',
        example: 'Lorem ipsum dolor sit amet.',
      },
      {
        variable: '{{lorem.paragraph}}',
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      },
    ],
  },
  {
    category: 'Commerce',
    items: [
      { variable: '{{commerce.productName}}', example: 'Ergonomic Keyboard' },
      { variable: '{{commerce.price}}', example: '99.99' },
      { variable: '{{commerce.department}}', example: 'Electronics' },
    ],
  },
  {
    category: 'Date & Time',
    items: [
      { variable: '{{date.past}}', example: '2023-05-12T14:22:11Z' },
      { variable: '{{date.future}}', example: '2028-11-01T08:00:00Z' },
    ],
  },
  {
    category: 'Company',
    items: [
      { variable: '{{company.name}}', example: 'Acme Corp' },
      { variable: '{{company.industry}}', example: 'Technology' },
    ],
  },
]
