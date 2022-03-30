(() => ({
  name: 'calendar',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { FullCalendar, dayGridPlugin } = window.MaterialUI;

    return (
      <>
        <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
      </>
    );
  })(),
  styles: () => () => {
    return {
      root: {},
    };
  },
}))();
