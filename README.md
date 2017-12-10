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
  
  
Attempted to use Component for http requests
    Problem. If done during "render" as a function, results in same request being repeated
    multiple times, cycling every second.
    
Instead, made it a class
   - issue request during "mounted"
        but only issues request at startup.
   - added request during willUpdate???,
        but had to compare new props with old props to
        to avoid repetitive requests.
   - New problem: can't reissue the same request twice in a row.
   
Maybe, add a "request number" to state?

Overall, this is probably the wrong approach.
Maybe treat it like a signal, as a stream of requests.
Requests get mapped to future completions,
which get mapped to desired data, which cause updates.

Rather than passing callbacks, pass a signal instead.
The signal updates state at some higher level, which propagates
downward as properties. 
Maybe the intermediate state isn't necessary, which would 
make things even more "functional".

A dummy "n+1" incrementor on the signal could ensure each event
gets processed if desired. Is that kosher?
Kind of like including current timestamp in event, so it should be.
    
    