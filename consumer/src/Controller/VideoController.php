<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class VideoController extends AbstractController {

    #[Route('/video', name: 'video_consumer', methods: ['POST'])]
    public function send(Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if(is_array($data) && !empty($data["message"])){
            return new JsonResponse(['message' => 'Your video message is '. $data["message"]]);
        }
        return new JsonResponse([
            'error' => 'Bad Request',
            'message' => 'The request is invalid. Please provide the \'message\' in the request body.'
        ], Response::HTTP_BAD_REQUEST);
    }
}