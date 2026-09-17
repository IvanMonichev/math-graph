import { test, expect } from '@playwright/test';

test('sections switch the structured graph', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Алгебра', exact: true })).toBeVisible();
  await expect(page.locator('.react-flow__node')).toHaveCount(17);
  expect(
    await page.evaluate(async () => (await document.fonts.load('14px "YS Text"')).length),
  ).toBe(1);
  await expect(page.getByRole('button', { name: 'Теорема Виета', exact: true })).toBeInViewport();
  await expect(page.getByText('Путь изучения', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Карта знаний', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (isMobile) await page.getByRole('button', { name: 'Открыть разделы' }).click();
  await expect
    .poll(() =>
      page.locator('.brand:visible img').evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.locator('.section-tree:visible .menu-label').filter({ hasText: 'Арифметика' }).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'Арифметика', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('click selects a term and its separate button opens material', async ({ page, isMobile }) => {
  await page.goto('./#/?category=arithmetic');
  const term = page.getByRole('button', { name: 'Числа', exact: true });
  if (!isMobile) {
    await term.hover();
    await expect(page.locator('.term-definition').filter({ visible: true })).toContainText(
      'Числа описывают количество, порядок и результат измерения.',
    );
    await expect(page).toHaveURL(/category=arithmetic/);
  }
  await term.click();
  await expect(page).toHaveURL(/category=arithmetic/);
  await expect(page.locator('[data-id="numbers"] .topic-node')).toHaveClass(/is-selected/);
  await page.getByRole('button', { name: 'Открыть материал: Числа', exact: true }).click();
  await expect(page).toHaveURL(/topics\/numbers$/);
  await expect(page.getByRole('heading', { name: 'Числа', exact: true })).toBeVisible();
  await expect(page.locator('.markdown')).toContainText('Рациональные числа');
  await expect(page.locator('.markdown .katex').first()).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await expect(page.locator('.topic-breadcrumbs')).toContainText('Арифметика');
});

test('search centers the selected term', async ({ page }) => {
  await page.goto('./#/?category=arithmetic');
  await page.getByRole('combobox', { name: 'Поиск по темам' }).fill('Многочлены');
  await page.locator('.search-result').filter({ hasText: 'Многочлены' }).click();
  await expect(page).toHaveURL(/category=algebra/);
  await expect(page.locator('[data-id="polynomial"] .topic-node')).toHaveClass(/is-selected/);
  await expect(page.getByRole('button', { name: 'Многочлены', exact: true })).toBeInViewport();
});

test('geometry has connected terms and definitions', async ({ page, isMobile }) => {
  await page.goto('./#/?category=geometry');
  await expect(page.locator('.react-flow__node')).toHaveCount(17);
  const term = page.getByRole('button', { name: 'Треугольник', exact: true });
  if (!isMobile) {
    await term.hover();
    await expect(page.locator('.term-definition').filter({ visible: true })).toContainText(
      'Сумма его внутренних углов равна 180°',
    );
  }
  await term.click();
  await page.getByRole('button', { name: 'Открыть материал: Треугольник', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Треугольник', exact: true })).toBeVisible();
  await expect(page.locator('.markdown')).toContainText('три точки');
});

test('zoom and fit controls work', async ({ page }) => {
  await page.goto('./#/?category=arithmetic');
  const scale = page.locator('.graph-controls > span');
  await expect(page.locator('.react-flow__node')).toHaveCount(4);
  const before = await scale.textContent();
  await page.getByRole('button', { name: 'Увеличить масштаб' }).click();
  await expect(scale).not.toHaveText(before ?? '');
  await page.getByRole('button', { name: 'Показать весь граф' }).click();
  await expect(page.getByRole('button', { name: 'Числа', exact: true })).toBeInViewport();
});

test('highlighted terms show definitions and open related material', async ({ page, isMobile }) => {
  await page.goto('./#/topics/numbers');
  const term = page.locator('.markdown').getByRole('link', { name: 'дроби', exact: true });
  await expect(term).toHaveClass('term-link');
  await expect(page.locator('.markdown strong').first()).toHaveText('числовые множества');
  if (!isMobile) {
    await term.hover();
    await expect(page.locator('.term-definition').filter({ visible: true })).toContainText(
      'Дробь выражает отношение двух чисел',
    );
  }
  await term.click();
  await expect(page).toHaveURL(/topics\/fractions$/);
  await expect(page.getByRole('heading', { name: 'Дроби', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator('.markdown')).toContainText('числитель');
  await page
    .locator('.topic-breadcrumbs')
    .getByRole('link', { name: 'Арифметика', exact: true })
    .click();
  await expect(page.locator('.react-flow__node')).toHaveCount(4);
});

test('sidebar roots expand without disclosure icons', async ({ page, isMobile }) => {
  await page.goto('./#/?category=arithmetic');
  if (isMobile) await page.getByRole('button', { name: 'Открыть разделы' }).click();
  const tree = page.locator('.section-tree:visible');
  const branch = tree
    .locator('.ant-tree-treenode')
    .filter({ has: page.locator('.menu-label').filter({ hasText: 'Арифметика' }) });
  await expect(branch.locator('.ant-tree-switcher')).not.toBeVisible();
  await expect(tree.getByText('Дроби', { exact: true })).toBeVisible();
  await branch.locator('.menu-label').click();
  await expect(tree.getByText('Дроби', { exact: true })).not.toBeVisible();
  await branch.locator('.menu-label').click();
  await tree.getByText('Дроби', { exact: true }).click();
  await expect(page).toHaveURL(/topics\/fractions$/);
  await expect(page.getByRole('heading', { name: 'Дроби', exact: true })).toBeVisible();
});

test('only sections are shown and missing materials have a recovery action', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByText('Все темы', { exact: true })).toHaveCount(0);
  await page.goto('./#/topics/missing');
  await expect(page.getByText('Тема не найдена', { exact: true }).last()).toBeVisible();
  await page.getByRole('button', { name: 'К разделам' }).click();
  await expect(page).toHaveURL(/\/math-graph\/#\/$/);
});
