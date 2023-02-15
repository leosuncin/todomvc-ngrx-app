/* eslint @typescript-eslint/no-unused-vars: ["warn", { "ignoreRestSiblings": true } ] */
import { createEntityAdapter, EntityState, Update } from '@ngrx/entity';
import {
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';

export interface TodoState extends EntityState<Todo> {
  filter: Filter;
  pickedTodoId: Todo['id'] | null;
}

export const todoAdapter = createEntityAdapter<Todo>();

const initialState: TodoState = todoAdapter.getInitialState({
  filter: 'all' as Filter,
  pickedTodoId: null,
});

function assertFilter(filter: string): asserts filter is Filter {
  if (!['all', 'active', 'completed'].includes(filter)) {
    throw new Error(`Invalid filter: ${filter}`);
  }
}

export const todoActions = createActionGroup({
  source: 'Todo',
  events: {
    Add: (title: string) => ({
      title,
      completed: false,
      id: crypto.randomUUID(),
    }),
    Toggle: ({
      id,
      completed,
    }: Pick<Todo, 'completed' | 'id'>): Update<Todo> => ({
      id,
      changes: { completed },
    }),
    'Change title': ({
      id,
      title,
    }: Pick<Todo, 'title' | 'id'>): Update<Todo> => ({
      id,
      changes: { title },
    }),
    Remove: props<Pick<Todo, 'id'>>(),
    'Change filter': (filter: Filter) => {
      assertFilter(filter);
      return { filter };
    },
    'Toggle all': props<Pick<Todo, 'completed'>>(),
    'Clear all completed': emptyProps(),
    'Pick todo': props<Pick<Todo, 'id'>>(),
    'Clear picked': emptyProps(),
  },
});

export const todoFeature = createFeature({
  name: 'todo',
  reducer: createReducer(
    initialState,
    on(todoActions.add, (state, { type, ...entity }) =>
      todoAdapter.addOne(entity, state)
    ),
    on(
      todoActions.toggle,
      todoActions.changeTitle,
      (state, { type, ...update }) => todoAdapter.updateOne(update, state)
    ),
    on(todoActions.remove, (state, { id }) => todoAdapter.removeOne(id, state)),
    on(
      todoActions.changeFilter,
      (state, { filter }): TodoState => ({ ...state, filter })
    ),
    on(todoActions.toggleAll, (state, { completed }) =>
      todoAdapter.updateMany(
        todoAdapter
          .getSelectors()
          .selectAll(state)
          .map(({ id }): Update<Todo> => ({ id, changes: { completed } })),
        state
      )
    ),
    on(todoActions.clearAllCompleted, (state) =>
      todoAdapter.removeMany(
        todoAdapter
          .getSelectors()
          .selectAll(state)
          .filter(({ completed }) => completed)
          .map(({ id }) => id),
        state
      )
    ),
    on(
      todoActions.pickTodo,
      (state, { id }): TodoState => ({ ...state, pickedTodoId: id })
    ),
    on(
      todoActions.clearPicked,
      (state): TodoState => ({ ...state, pickedTodoId: null })
    )
  ),
  extraSelectors({ selectTodoState, selectFilter }) {
    const { selectAll, selectTotal } =
      todoAdapter.getSelectors(selectTodoState);

    return {
      selectActiveCount: createSelector(selectAll, (todos) =>
        todos.reduce((count, todo) => count + Number(!todo.completed), 0)
      ),
      selectCompletedCount: createSelector(selectAll, (todos) =>
        todos.reduce((count, todo) => count + Number(todo.completed), 0)
      ),
      selectTotalCount: selectTotal,
      selectFilteredTodos: createSelector(
        selectAll,
        selectFilter,
        (todos, filter) => {
          switch (filter) {
            case 'active':
              return todos.filter((todo) => !todo.completed);
            case 'completed':
              return todos.filter((todo) => todo.completed);
            default:
              return todos;
          }
        }
      ),
    };
  },
});
