;; hello world

(define-public (say-hi)
  (ok "hello world")
)

(define-public (echo-number (val int))
  (ok val)
)

;; streams

(define-map streams
  ((id uint))
  (
    (start-block uint)
    (recipient principal)
    (sender principal)
  )
)

(define-data-var next-stream-id uint u1)

(define-public (make-stream
    (recipient principal)
  )
  (begin
    (map-set streams 
      ((id (var-get next-stream-id)))
      (
        (start-block block-height)
        (recipient recipient)
        (sender tx-sender)
      )
    )
    (var-set next-stream-id (+ (var-get next-stream-id) u1))
    (ok 'true)
  )
)

(define-public (get-stream
    (stream-id uint)
  )
  (
    ok
    (unwrap-panic
      (map-get? streams (tuple (id stream-id)))
    )
  )
)

;; statuses

(define-map statuses
  (
    (author principal)
  )
  (
    (status (buff 512))
  )
)

(define-read-only (get-status (author principal))
  (begin
    (print author)
    (default-to ""
      (get status (map-get? statuses {author author}))
    )
  )
)

(define-public (write-status!
    (status (buff 512))
  )
  (begin
    (print tx-sender)
    (map-set statuses
      ((author tx-sender))
      ((status status))
    )
    (ok status)
  )
)
