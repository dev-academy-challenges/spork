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
        'kata-object-array',
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
    w.on(w.week(1), w.thu(), w.all(), w.deploy('tdd-bowling-kata', 'conways')),
    w.on(
      w.week(1),
      w.fri(),
      w.all(),
      w.deploy('kata-typescript', 'whats-on-tvite')
    ),
    w.on(
      w.week(2),
      w.mon(),
      w.all(),
      w.deploy('react-paws-for-effect', 'charlottes-web-log')
    ),
    w.on(
      w.week(2),
      w.tue(),
      w.all(),
      w.deploy('react-state-kata', 'broken-kaleidoscope', 'enspiraled')
    ),
    w.on(w.week(2), w.wed(), w.all(), w.deploy('worldwide-routing')),
    w.on(
      w.week(2),
      w.thu(),
      w.all(),
      w.deploy(
        'react-form-demo',
        'kata-react-forms',
        'boilerplate-react',
        'lightning-talks'
      )
    ),
    w.on(w.week(3), w.mon(), w.all(), w.deploy('consuming-clientside-apis')),
    w.on(w.week(3), w.tue(), w.all(), w.deploy('query-em-all')),
    w.on(w.week(3), w.wed(), w.all(), w.deploy('korihi', 'software-quality')),
    w.on(
      w.week(3),
      w.thu(),
      w.all(),
      w.deploy('boilerplate-phase1, boilerplate-phase1-tw')
    ),
    w.on(
      w.week(4),
      w.mon(),
      w.all(),
      w.deploy('express-server', 'art-gallery')
    ),
    w.on(w.week(4), w.tue(), w.all(), w.deploy('pupparazzi')),
    w.on(w.week(4), w.wed(), w.all(), w.deploy('consuming-server-apis')),
    w.on(
      w.week(4),
      w.wed(),
      w.online(),
      w.deploy('boilerplate-fullstack', 'boilerplate-fullstack-routing')
    ),
    w.on(
      w.week(4),
      w.thu(),
      w.all(),
      w.deploy('boilerplate-react-api', 'boilerplate-react-api-tw')
    ),
    w.on(w.week(5), w.mon(), w.all(), w.deploy('knex-todo-cli')),
    w.on(
      w.week(5),
      w.tue(),
      w.all(),
      w.deploy('flight-club', 'database-diagram')
    ),
    w.on(w.week(5), w.wed(), w.all(), w.deploy('dreamfest')),
    w.on(
      w.week(5),
      w.thu(),
      w.all(),
      w.deploy('boilerplate-fullstack', 'boilerplate-fullstack-routing')
    ),
    w.on(w.week(6), w.mon(), w.all(), w.deploy('jwt-auth')),
    w.on(w.week(6), w.tue(), w.all(), w.deploy('todo-full-stack')),
    w.on(w.week(6), w.thu(), w.all(), w.deploy('boilerplate-fullstack-auth'))
  )

export default template
