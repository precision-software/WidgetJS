np# WidgetJS
A Javascript experimental widget for browsing a remote webservice


Part of an overall project working towards a sound and practical toolset
  - mathematically sound
     - "functional" programming
     - abstract algebra and category theory
     - modelling of change (Streams, Signals, ...)
  - user interfaces, services, large data
  - consistent language and tools
  - active community of developers

Promising Tools
  - React as a model of UI composition, keeping functional part.
    (augment with Signal streams)
  - NativeScript as base UI components
    (with fake DOM or renderer for unit testing on development machines)
  - Scala as a hybrid functional language
    - compile for compatibility with Java, C++(swift), ES6 (Javascript)
  - Cats for functional tools and mapping from one domain to another
  - Need macro facility to transform new structures and domain languages into workable Scala.


Steps (partially ordered)
  - React for UI composition
  - Add NativeScript components to React.
  - Translate to Scala
  - Deploy on web, android, ios, standalone.
  - Bring in Signals and make purely functional.
  - Make use of Cats and abstract algebra
  - Reactive concepts on server side identical to UI side
  - Macros to extend and optimize Scala
  
  
Current using:
  - react-native-web