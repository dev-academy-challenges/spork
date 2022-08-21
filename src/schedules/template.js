/**
 * @type {import('./Algebra.js').TTemplate}
 */
const template = (w) =>
  w.schedule(
    w.on(
      w.week(1),
      w.mon(),
      w.all(),
      w.deploy('two-truths-and-a-lie', 'kata-objects-and-arrays')
    ),
    w.on(w.week(1), w.mon(), w.online(), w.deploy('remote-git-iam')),
    w.on(
      w.week(1),
      w.tue(),
      w.all(),
      w.deploy(
        'kata-types-modules',
        'kata-strings-numbers-modules',
        'exercise-arrays',
        'object-array-practice',
        'kata-number-patterns',
        'kata-fizzbuzz'
      )
    ),
    w.on(
      w.week(1),
      w.wed(),
      w.all(),
      w.deploy('kata-data-structures', 'bowling-kata')
    ),
    w.on(w.week(1), w.thu(), w.all(), w.deploy('tdd-bowling-kata')),
    w.on(w.week(1), w.thu(), w.except(w.welly()), w.deploy('conways')),
    w.on(w.week(1), w.fri(), w.all(), w.deploy('ascii-art-reader')),
    w.on(
      w.week(1),
      w.fri(),
      w.welly(),
      w.deploy(
        'conways',
        'exercise-arrays',
        'object-array-practice',
        'kata-number-patterns',
        'kata-fizzbuzz'
      )
    ),
    w.on(w.week(2), w.mon(), w.all(), w.deploy('express-server')),
    w.on(w.week(2), w.tue(), w.all(), w.deploy('server-side-rendering')),
    w.on(w.week(2), w.wed(), w.all(), w.deploy('pupparazzi')),
    w.on(w.week(2), w.thu(), w.all(), w.deploy('heroku-checklist')),
    w.on(w.week(3), w.mon(), w.all(), w.deploy('knex-todo-cli')),
    w.on(w.week(3), w.tue(), w.all(), w.deploy('knex-joins-stories')),
    w.on(w.week(3), w.wed(), w.all(), w.deploy('database-diagram', 'dreamfest')),
    w.on(
      w.week(3),
      w.thu(),
      w.all(),
      w.deploy('boilerplate-knex')
    ),
    w.on(
      w.week(4),
      w.mon(),
      w.all(),
      w.deploy('react-paws-for-effect', 'charlottes-web-log')
    ),
    w.on(
      w.week(4),
      w.tue(),
      w.all(),
      w.deploy('broken-kaleidoscope', 'memory', 'enspiraled')
    ),
    w.on(w.week(4), w.wed(), w.all(), w.deploy('worldwide-routing')),
    w.on(w.week(4), w.thu(), w.all(), w.deploy('boilerplate-react-webpack')),
    w.on(w.week(5), w.mon(), w.all(), w.deploy('charlottes-web-log-api')),
    w.on(w.week(5), w.tue(), w.all(), w.deploy('react-to-web-api')),
    w.on(w.week(5), w.wed(), w.all(), w.deploy('consuming-external-apis')),
    w.on(w.week(6), w.mon(), w.except(w.online()), w.deploy('redux-minimal')),
    w.on(
      w.week(6),
      w.mon(),
      w.online(),
      w.deploy(
        'redux-zoo',
        'todo-full-stack',
        'my-fullstack-collection',
        'my-fullstack-collection-scss',
        'boilerplate-fullstack',
        'boilerplate-fullstack-scss'
      )
    ),
    w.on(w.week(6), w.tue(), w.except(w.online()), w.deploy('sweet-as-beers')),
    w.on(w.week(6), w.tue(), w.online(), w.deploy('async-redux-stories')),
    w.on(w.week(6), w.tue(), w.akl(), w.deploy('my-fullstack-collection', 'my-fullstack-collection-scss', 'todo-full-stack')),
    w.on(w.week(6), w.wed(), w.akl(), w.deploy('sweet-as-organics-api')),
    w.on(w.week(6), w.wed(), w.welly(), w.deploy('async-redux-stories')),
    w.on(w.week(6), w.wed(), w.online(), w.deploy('jwt-auth')),
    w.on(
      w.week(6),
      w.thu(),
      w.akl(),
      w.deploy(
        'boilerplate-fullstack',
        'boilerplate-fullstack-scss'
      )
    ),
    w.on(w.week(7), w.mon(), w.except(w.online()), w.deploy('jwt-auth')),
    w.on(
      w.week(7),
      w.mon(),
      w.welly(),
      w.deploy(
        'todo-full-stack',
        'my-fullstack-collection-scss',
        'sweet-as-organics-api'
      )
    ),
    w.on(
      w.week(7),
      w.thu(),
      w.welly(),
      w.deploy(
        'lost-and-found',
        'show-me-the-money'
      )
    )
  )

export default template
