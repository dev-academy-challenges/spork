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
        'kata-number-patterns'
      )
    ),
    w.on(
      w.week(1),
      w.wed(),
      w.all(),
      w.deploy('kata-data-structures', 'bowling-kata')
    ),
    w.on(w.week(1), w.thu(), w.all(), w.deploy('tdd-bowling-kata', 'conways')),
    w.on(
      w.week(1),
      w.thu(),
      w.welly(),
      w.deploy('tdd-bowling-kata-solution', 'conways-solution')
    ),
    w.on(w.week(1), w.fri(), w.all(), w.deploy('ascii-art-reader')),
    w.on(w.week(1), w.fri(), w.welly(), w.deploy('ascii-art-reader-solution')),
    w.on(w.week(2), w.mon(), w.all(), w.deploy('express-server')),
    w.on(w.week(2), w.mon(), w.welly(), w.deploy('express-server-solution')),
    w.on(w.week(2), w.tue(), w.all(), w.deploy('server-side-rendering')),
    w.on(
      w.week(2),
      w.tue(),
      w.welly(),
      w.deploy('server-side-rendering-solution')
    ),
    w.on(w.week(2), w.wed(), w.all(), w.deploy('pupparazzi')),
    w.on(w.week(2), w.wed(), w.welly(), w.deploy('pupparazzi-solution')),
    w.on(w.week(2), w.thu(), w.all(), w.deploy('heroku-checklist')),
    w.on(w.week(3), w.mon(), w.all(), w.deploy('knex-todo-cli')),
    w.on(w.week(3), w.mon(), w.welly(), w.deploy('knex-todo-cli-solution')),
    w.on(w.week(3), w.tue(), w.all(), w.deploy('knex-joins-stories')),
    w.on(
      w.week(3),
      w.tue(),
      w.welly(),
      w.deploy('knex-joins-stories-solution')
    ),
    w.on(w.week(3), w.wed(), w.all(), w.deploy('database-diagram')),
    w.on(w.week(3), w.wed(), w.welly(), w.deploy('knex-relationships-stories')),
    w.on(w.week(3), w.wed(), w.except(w.welly()), w.deploy('dreamfest')),
    w.on(
      w.week(3),
      w.thu(),
      w.all(),
      w.deploy('lightning-talks', 'boilerplate-knex')
    ),
    w.on(
      w.week(4),
      w.mon(),
      w.all(),
      w.deploy('react-paws-for-effect', 'charlottes-web-log')
    ),
    w.on(
      w.week(4),
      w.mon(),
      w.welly(),
      w.deploy('react-paws-for-effect-solution', 'charlottes-web-log-solution')
    ),
    w.on(
      w.week(4),
      w.tue(),
      w.all(),
      w.deploy('broken-kaleidoscope', 'memory', 'enspiraled')
    ),
    w.on(
      w.week(4),
      w.tue(),
      w.welly(),
      w.deploy(
        'broken-kaleidoscope-solution',
        'memory-solution',
        'enspiraled-solution'
      )
    ),

    w.on(w.week(4), w.wed(), w.all(), w.deploy('worldwide-routing')),
    w.on(w.week(4), w.wed(), w.welly(), w.deploy('worldwide-routing-solution')),
    w.on(w.week(4), w.thu(), w.all(), w.deploy('boilerplate-react-webpack')),
    w.on(w.week(5), w.mon(), w.all(), w.deploy('charlottes-web-log-api')),
    w.on(w.week(5), w.tue(), w.all(), w.deploy('react-to-web-api')),
    w.on(w.week(5), w.wed(), w.all(), w.deploy('consuming-external-apis')),
    w.on(w.week(6), w.mon(), w.all(), w.deploy('redux-minimal')),
    w.on(w.week(6), w.mon(), w.welly(), w.deploy('redux-minimal-solution')),
    w.on(w.week(6), w.tue(), w.all(), w.deploy('sweet-as-beers')),
    w.on(w.week(6), w.tue(), w.welly(), w.deploy('sweet-as-beers-solution')),
    w.on(w.week(6), w.wed(), w.akl(), w.deploy('sweet-as-organics-api')),
    w.on(
      w.week(6),
      w.wed(),
      w.except(w.akl()),
      w.deploy('async-redux-stories')
    ),
    w.on(
      w.week(6),
      w.wed(),
      w.all(),
      w.deploy('todo-full-stack', 'my-fullstack-collection')
    ),
    w.on(w.week(6), w.thu(), w.all(), w.deploy('boilerplate-fullstack')),
    w.on(w.week(7), w.mon(), w.all(), w.deploy('jwt-auth'))
  )

module.exports = template
