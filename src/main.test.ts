import Vue3AutoRouteRecord from './main'
import * as route from './main'

test('should set options property', () => {
  const opts = {
    baseDir: './src/',
    outputDir: './dist'
  }

  const plugin = new Vue3AutoRouteRecord(opts);

  expect(plugin.options).toEqual(
    expect.objectContaining(opts)
  )
})

test('glob test', () => {
  const expected = ['main.test.ts', 'main.ts']
  const files = route.getRoutableFiles('src', 'ts')

  expect(expected).toEqual(files)
})

test('validate route config', () => {
  const files = [
    'index.vue',
    'about.vue',
    'user/one.vue',
  ];

  const expected = [{
    real: 'index.vue',
    name: 'index',
    path: '/',
  },
  {
    real: 'about.vue',
    name: 'about',
    path: '/about'
  },
  {
    real: 'user/one.vue',
    name: 'user-one',
    path: '/user/one'
  }]

  const routeConfig = route.getRouteObjects(files);
  expect(JSON.stringify(expected)).toEqual(JSON.stringify(routeConfig))
})

test('make route string', () => {

  const data = [{
    real: 'index.vue',
    name: 'index',
    path: '/',
  },
  {
    real: 'about.vue',
    name: 'about',
    path: '/about'
  },
  {
    real: 'user/one.vue',
    name: 'user-one',
    path: '/user/one'
  }]

  const expected =
`const routes = [
  {
    component: () => import(/* webpackChunkName: "pf-index" */ '@/views/index.vue'),
    name: 'index',
    path: '/'
  },
  {
    component: () => import(/* webpackChunkName: "pf-about" */ '@/views/about.vue'),
    name: 'about',
    path: '/about'
  },
  {
    component: () => import(/* webpackChunkName: "pf-user-one" */ '@/views/user/one.vue'),
    name: 'user-one',
    path: '/user/one'
  }
]
export default routes`

  const chunkPrefix = 'pf-'
  const outputPrefix = '@/views/'
  expect(expected).toEqual(route.makeRouteString(data, chunkPrefix, outputPrefix));
})
